import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Menu } from "~~/components/Menu";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => (
  <>
    <Head>
      <title>BG Media | BuidlGuidl Grants</title>
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon.ico" />
      <meta
        name="description"
        content="Funding high leverage BuidlGuidl members for their designs, social media contributions, and other media related work."
      />
      <meta property="og:title" content="BG Media | BuidlGuidl Grants" />
      <meta
        property="og:description"
        content="Funding high leverage BuidlGuidl members for their designs, social media contributions, and other media related work."
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:image" content="https://media.buidlguidl.com/thumbnail.png" />
      <meta property="twitter:image" content="https://media.buidlguidl.com/thumbnail.png" />
    </Head>
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 p-4 items-start">
      <div className="flex-col items-start">
        <p className="m-0 text-xl md:text-3xl !leading-7">
          <Link href="/">BG Media</Link>
        </p>
        <p className="m-0  leading-5">BuidlGuidl Media</p>
      </div>
      <div className="navbar-end flex-grow">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
    <Menu />
  </>
);
