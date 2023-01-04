import React from "react";
import assets from "../assets";
import { footerLinks } from "../constants";
import Link from "next/link";

const Footer = () => {
  return (
    <section className="pb-16" id="footer">
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start mt-32">
        <div className="flex flex-col w-[338px] lg:w-[270px] mr-0 lg:mr-[152px] items-center lg:items-start">
          <img
            src={assets.footerLogo.src}
            alt="carapace"
            className="w-[120px]"
          />
          <p className="font-manrope font-normal text-[20px] sm:text-base text-center lg:text-left tracking-[0.01em] text-black opacity-40 mb-0 mt-8 text-">
            Accelerating the world&apos;s transition to decentralized finance by
            re-imagining how we manage credit.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between w-[260px] md:w-[560px]">
          {footerLinks.map((footerlink, index) => (
            <div
              key={footerlink.title}
              className={`flex flex-col sm:first:my-0 first:mt-[30px] items-center lg:items-start`}
            >
              <hr
                className={`w-[260px] lg:hidden ${
                  index !== 0 ? "opacity-30" : "opacity-0"
                }`}
              />
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
