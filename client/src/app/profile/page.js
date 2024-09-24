"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "../marketplace.json";
import "./profile.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import axios from "axios";
import NFTTile from "../components/nftCard/NFTCard";

export default function Profile() {
  const [items, setItems] = useState();
  const [totalPrice, setTotalPrice] = useState("0");
  const { isConnected, userAddress, signer } = useContext(WalletContext);

  async function getNFTitems() {
    let sumPrice = 0;
    const itemsArray = [];
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    let transaction = await contract.getMyNFTs();

    for (const i of transaction) {
      const tokenId = parseInt(i.tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = (await axios.get(tokenURI)).data;
      const price = ethers.formatEther(i.price);

      const item = {
        price,
        tokenId,
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };

      itemsArray.push(item);
      sumPrice += Number(price);
    }
    return { itemsArray, sumPrice };
  }
 
  useEffect(() => {  
    const fetchData = async () => {
      try {
        const { itemsArray, sumPrice } = await getNFTitems();
        setItems(itemsArray);
        setTotalPrice(sumPrice);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
      }
    };

    fetchData();
  }, [isConnected]);

  return (
    <>
      <Header />
      <div className="bggradient">
        <div className="container">
          {isConnected ? (
            <>
              <div className="userInfo text-center">
                <span className="label">Wallet Address:</span>
                <span className="address">{userAddress}</span>
              </div>
              <div className="stats text-center">
                <div className="stat">
                  <span className="label">Number of NFTs:</span>
                  <span className="value">{items?.length}</span>
                </div>
                <div className="stat text-center">
                  <span className="label">Total Value:</span>
                  <span className="value">{totalPrice} ETH</span>
                </div>
              </div>
              <div className="nftSection">
                <h2 className="heading">Your NFTs</h2>
                {items?.length > 0 ? (
                  <div className="nftGrid">
                    {items?.map((value, index) => (
                      <NFTTile item={value} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className="noNFT">You don't have any NFT...</div>
                )}
              </div>
            </>
          ) : (
            <div className="notConnected min-h-screen">You are not connected...</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}