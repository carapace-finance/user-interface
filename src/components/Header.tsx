import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { Menu } from "lucide-react";
import assets from "../assets";
import { shortAddress } from "@utils/utils";
import ConnectWalletPopup from "@components/ConnectWalletPopUp";
import ChainLogo from "@components/ChainLogo";
import { HEADER_LINKS } from "@constants/index";

const Header = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <nav className="header bg-white h-16 px-2 sm:px-4 fixed w-full z-30 top-0 left-0 shadow-md">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link className="shrink-0" href="/">
          <Image
            src={assets.headerLogo.src}
            alt="carapace"
            height="36"
            width="160"
            unoptimized
          />
        </Link>
        <div className="flex items-center md:order-2">
          {isConnected ? (
            <>
              <div className="flex items-center border border-customGrey py-1 pr-4 pl-2 rounded-md mr-2 text-sm h-8">
                <ChainLogo chainId={chain.id} klass="mr-1" />
                {chain.name}
              </div>
              <button
                type="button"
                className="btn-outline rounded-md py-1 px-4 h-8 text-sm"
                onClick={() => disconnect()}
              >
                {shortAddress(address)}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-outline rounded-md py-1 px-4 h-8 text-sm"
              onClick={() => setModalOpen(true)}
            >
              Connect Wallet
            </button>
          )}
          <ConnectWalletPopup
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />
          <button
            type="button"
            className="inline-flex items-center p-2 text-sm text-customBlue rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            menuOpen ? "visible" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul className="fixed right-0 left-0 top-16 text-center md:relative md:top-auto md:right-auto md:left-auto flex flex-col p-4 rounded-lg bg-customPristineWhite md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white shadow-lg md:shadow-none">
            {HEADER_LINKS.map((item: any) => (
              <li key={item.key}>
                <Link
                  href={item.link}
                  className={`${
                    item.activePaths.includes(router.pathname)
                      ? "text-customBlue font-medium"
                      : ""
                  } hover:text-customBlue block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0`}
                >
                  <h5>{item.title}</h5>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
