import Image from "next/image";
import Header from "./components/header/Header";
import "./App.css";
import Footer from "./components/footer/Footer";
import Link from "next/link";
export default function HomePage() {
  return (
    <>
      <Header />

      <div className="bggradient">
      <div className="container">
        <div className="flex">
        <div className="right order2"><Image src="/hero.png" alt="NFTs" width={675} height={600} /></div>
          <div className="left">
            <h2 className="heading">
              Where Art Meets Innovation, Step into WeirdLAB!
            </h2>
            <p className="description">
              Collect the nexus of creativity and innovation at WeirdLAB. Uncover a
              realm of digital marvels, and together, let's redefine the future of
              collectibles.
            </p>
            <div className="btns">
              <Link
                href="/marketplace"
                className="btn buyBtn"
              >
                Buy Now!
              </Link>
              <Link href="/sellNFT" className="btn">
                List Now!
              </Link>
            </div>
          </div>
          
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
}