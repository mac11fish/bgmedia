import React from "react";
import type { NextPage } from "next";
import { StreamContractInfo } from "~~/components/StreamContractInfo";

const Home: NextPage = () => {
  return (
    <>
      <div className="max-w-3xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary-content bg-primary inline-block p-2">Welcome</h1>
        <div>
          <p className="mt-0">
            Funding high leverage BuidlGuidl members for their designs, social media contributions, and other media
            related work.
          </p>
          <p>Made possible by the BuidlGuidl!</p>
        </div>
        <div className="mb-10">
          <StreamContractInfo />
        </div>
      </div>
    </>
  );
};

export default Home;
