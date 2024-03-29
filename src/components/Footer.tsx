import React from "react";
import assets from "@/assets";
import { FOOTER_LINKS } from "@/constants";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <section className="pb-16 pt-32 footer" id="footer">
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start container mx-auto">
        <div className="flex flex-col w-[338px] lg:w-[270px] mr-0 lg:mr-[152px] items-center lg:items-start">
          <Image
            src={assets.footerLogo.src}
            alt="carapace"
            width="120"
            height="82"
          />
          <p className="font-manrope font-normal text-[20px] sm:text-base text-center lg:text-left tracking-[0.01em] text-black opacity-40 mb-0 mt-8 text-">
            Accelerating the world&apos;s transition to decentralized finance by
            re-imagining how we manage credit.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between w-[260px] md:w-[560px]">
          {FOOTER_LINKS.map((footerlink, index) => (
            <div
              key={footerlink.title}
              className="flex flex-col sm:first:my-0 first:mt-[30px] items-center lg:items-start pb-8"
            >
              <h4 className="text-[20px] sm:text-[16px] text-black">
                {footerlink.title}
              </h4>
              <ul className="list-none mt-2 md:mt-4">
                {footerlink.links.map((link, index) => (
                  <li
                    key={link.name}
                    className={`list-none font-normal text-[16px] sm:text-[16px] text-center lg:text-left cursor-pointer ${
                      index !== footerlink.links.length - 1 ? "mb-2" : "mb-0"
                    }`}
                  >
                    <Link
                      href={link.link}
                      target={link.target}
                      className="transition-all hover:text-black hover:no-underline hover:opacity-100 opacity-30"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Footer;
