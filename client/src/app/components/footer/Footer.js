import Link from "next/link";
import "./Footer.css";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="flex">
          <p>Copyright &copy; {year} WeirdLAB. All rights reserved!</p>
          <ul className="socialLinks">         
            <li>
              <Link target="_blank" href="https://github.com/helalmerchan"  >
                <Image
                  src="/github.png"
                  width={40}
                  height={40}
                  alt="github logo"
                />
              </Link>
            </li>
            <li>
              <Link target="_blank" href="https://twitter.com/devmhu">
                <Image
                  src="/twitter.png"
                  width={40}
                  height={40}
                  alt="twitter logo"
                />
              </Link>
            </li>
            <li>
              <Link target="_blank" href="https://www.linkedin.com/in/stackhelal/">
                <Image
                  src="/linkedin.png"
                  width={40}
                  height={40}
                  alt="linkedin logo"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}