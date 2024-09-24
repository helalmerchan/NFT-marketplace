"use client"
import { WalletContext } from "@/context/wallet";
import { BrowserProvider } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import "./Header.css";

export default function Header() {
    const { isConnected, setIsConnected, userAddress, setUserAddress, signer, setSigner } = useContext(WalletContext);  

    const connectWallet = async () => {
        if (!window.ethereum) {
            throw new Error("No crypto wallet found. Please install it.");
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setSigner(signer);
            const accounts = await provider.send("eth_requestAccounts", []);
            setIsConnected(true);
            setUserAddress(accounts[0]);
            const network = await provider.getNetwork();
            const chainId = network.chainId;
            const holeskyNetworkId = "17000";

            if (chainId.toString() !== holeskyNetworkId) {
                alert("Please switch to Holesky Network");
            }

        } catch (error) {
            console.error("Connection Error", error);
        }
    }

    return (
      <header className="header">
        <div className="container">
          <div className="flex">
            <h1 className="logo">
              <Link href="/">
                WeirdLAB
              </Link>
            </h1>
            <nav className="nav">
              <ul className="navLinks">
                <li>
                  <Link href="/marketplace" >
                    Market 
                  </Link>
                </li>
                <li>
                  <Link href="/sellNFT" >
                    List
                  </Link>
                </li>
                <li>
                  <Link href="/profile" >
                    Profile
                  </Link>
                </li>
              </ul>
              <button
                className={`ctaBtn ${isConnected ? "activebtn" : "inactivebtn"}`}
                onClick={connectWallet}
              >
                {isConnected ? (
                  <>{userAddress?.slice(0, 8)}...</>
                ) : (
                  "Connect wallet"
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>
    )
}
