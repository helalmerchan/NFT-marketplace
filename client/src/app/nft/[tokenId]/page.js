"use client";
import { WalletContext } from "@/context/wallet";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import MarketplaceJson from "../../marketplace.json";
import { ethers } from "ethers";
import axios from "axios";
import GetIpfsUrlFromPinata from "@/app/utils";
import Image from "next/image";
import "./single.css";
import Header from "@/app/components/header/Header";
import Footer from "@/app/components/footer/Footer";

export default function NFTPage() {
  const params = useParams();
  const tokenId = params.tokenId;
  const [item, setItem] = useState();
  const [msg, setmsg] = useState();
  const [btnContent, setBtnContent] = useState("Buy NFT");
  const { isConnected, userAddress, signer } = useContext(WalletContext);
  const router = useRouter();

  async function getNFTData() {
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );
    let tokenURI = await contract.tokenURI(tokenId);
    console.log(tokenURI);
    const listedToken = await contract.getNFTListing(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    console.log(tokenURI);
    const meta = (await axios.get(tokenURI)).data;
    const item = {
      price: meta.price,
      tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    return item;
  }


  useEffect(() => {
    
    async function fetchData() {
      if (!signer) return;
      try {
        const itemTemp = await getNFTData();
        setItem(itemTemp);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
        setItem(null);
      }
    }

    fetchData();
  }, [isConnected]);

  async function buyNFT() {
    try {
      if (!signer) return;
      let contract = new ethers.Contract(
        MarketplaceJson.address,
        MarketplaceJson.abi,
        signer
      );
      const salePrice = ethers.parseUnits(item.price, "ether").toString();
      setBtnContent("Processing...");
      setmsg("Buying the NFT... Please Wait (Upto 5 mins)");
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();
      alert("You successfully bought the NFT!");
      setmsg("");
      setBtnContent("Buy NFT");
      router.push("/");
    } catch (e) {
      console.log("Buying Error: ", e);
    }
  }

  return (
    <>
      <Header />
      <div className="bggradient">
        {isConnected ? (
          <div className="container">
            <div className="nftGrid">
              <Image src={item?.image} alt="" width={800} height={520} />
              <div className="details">
                <div className="stats">
                  <div className="stat">
                    <span className="label">Name:</span>
                    <span className="value">{item?.name}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Description:</span>
                    <span className="value">{item?.description}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Price:</span>
                    <span className="value">{item?.price} ETH</span>
                  </div>
                  <div className="stat">
                    <span className="label">Seller:</span>
                    <span className="value">{item?.seller}</span>
                  </div>
                </div>
                <div className="ctaBtn">
                  <div className="msg">{msg}</div>
                  {userAddress.toLowerCase() === item?.seller.toLowerCase() ? (
                    <div className="msgAlert">You already Own!</div>
                  ) : (
                    <button
                      onClick={() => {
                        buyNFT();
                      }}
                      className="Btn"
                    >
                      {btnContent === "Processing..." && (
                        <span className="spinner" />
                      )}
                      {btnContent}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="notConnected min-h-screen">You are not connected...</div>
        )}
      </div>
      <Footer />
    </>
  );
}