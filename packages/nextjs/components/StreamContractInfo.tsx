import React from "react";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { BanknotesIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const StreamContractInfo = () => {
  const { address } = useAccount();
  const { data: streamContract } = useDeployedContractInfo("CohortStreams");

  const { data: owner } = useScaffoldContractRead({
    contractName: "CohortStreams",
    functionName: "owner",
  });

  const { data: builderData } = useScaffoldContractRead({
    contractName: "CohortStreams",
    functionName: "streamedBuilders",
    args: [address],
  }) as {
    data: { cap: BigNumber } | undefined;
  };

  const amIAStreamdBuilder = builderData?.cap.gt(0);

  return (
    <>
      <div className="mt-16 text-xs">
        <div className="p-6 pb-12 bg-[#fff] text-[#000] rounded-tl-lg rounded-tr-lg">
          <p className="">
            Stream Contract
            <span
              className="tooltip text-white font-normal"
              data-tip="All streams and contributions are handled by a contract on Mainnet"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-2" />
            </span>
          </p>
          <div className="flex gap-2 items-baseline">
            <div className="flex flex-col items-center">
              <Address address={streamContract?.address} />
              <span className="text-xs text-[#323aa8]">Mainnet</span>
            </div>{" "}
            /
            <Balance address={streamContract?.address} className="text-3xl" />
          </div>
          {address && amIAStreamdBuilder && (
            <div className="mt-3">
              <label
                htmlFor="withdraw-modal"
                className="btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case"
              >
                <BanknotesIcon className="h-4 w-4" />
                <span>Withdraw</span>
              </label>
            </div>
          )}
        </div>
        <div className="bg-[#FFFFFFcc] text-[#000] text-xs p-6 mt-0 rounded-bl-lg rounded-br-lg">
          <p className="">Owner</p>
          <Address address={owner} />
        </div>
      </div>
    </>
  );
};
