
import GetIpfsUrlFromPinata from "@/app/utils";
import Image from "next/image";

import "./NFTCard.css";
import Link from "next/link";

export default function NFTCard({ item }) {
  const IPFSUrl = GetIpfsUrlFromPinata(item.image);

  const limitedDescription =
    item.description.length > 70
      ? item.description.substring(0, 70) + "..."
      : item.description;

  return (
    <div className="tile">
      <div className="imageContainer">
        <Image src={IPFSUrl} alt="" width={500} height={360} />
      </div>
      <div className="overlay">
        <Link href={`/nft/${item.tokenId}`} className="text">
          <strong>{item.name}</strong>
          <p>{limitedDescription}</p>
        </Link>
      </div>
    </div>
  );
}