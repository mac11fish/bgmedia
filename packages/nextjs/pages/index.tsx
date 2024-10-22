import React from "react";
import { Space_Grotesk } from "next/font/google";
import type { NextPage } from "next";
import { StreamContractInfo } from "~~/components/StreamContractInfo";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: "300" });

const Home: NextPage = () => {
  return (
    <>
      <div className="max-w-3xl space-y-12 px-4 py-8">
        <h1 className="font-bold">Welcome</h1>
        <div>
          <p className={`mt-0 text-4xl ${spaceGrotesk.className}`}>
            Funding high leverage BuidlGuidl members for their designs, social media contributions, and other media
            related work.
          </p>
          <p className="text-xs">Made possible by the BuidlGuidl!</p>
        </div>
        <div className="mb-10">
          <StreamContractInfo />
        </div>
      </div>
    </>
  );
};

export default Home;
