import React, { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { StreamContractInfo } from "~~/components/StreamContractInfo";
import { Address, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAddBuilderEvents } from "~~/hooks/useCohortAddBuilderEvents";
import { useCohortWithdrawEvents } from "~~/hooks/useCohortWithdrawEvents";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: "300" });

const Members: NextPage = () => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  const [builderList, setBuilderList] = useState<string[]>([]);

  const { data: allBuildersData, isLoading: isLoadingBuilderData } = useScaffoldContractRead({
    contractName: "CohortStreams",
    functionName: "allBuildersData",
    args: [builderList],
  });

  const { writeAsync: doWithdraw } = useScaffoldContractWrite({
    contractName: "CohortStreams",
    functionName: "streamWithdraw",
    args: [ethers.utils.parseEther(amount || "0"), reason],
  });

  const { data: allWithdrawEvents, isLoading: isWithdrawEventsLoading } = useCohortWithdrawEvents();

  const { data: addBuilderEvents, isLoading: isLoadingBuilderEvents } = useAddBuilderEvents();

  useEffect(() => {
    if (addBuilderEvents && addBuilderEvents.length > 0) {
      const fetchedBuilderList = addBuilderEvents.map((event: any) => event.id.split("-")[0]);
      setBuilderList(fetchedBuilderList);
    }
  }, [addBuilderEvents]);

  useEffect(() => {
    if (selectedAddress) {
      setFilteredEvents(allWithdrawEvents?.filter((event: any) => event.builder === selectedAddress) || []);
    }
  }, [selectedAddress, allWithdrawEvents]);

  return (
    <>
      <div className="max-w-3xl px-4 py-8 text-xs">
        <h1 className={`text-4xl font-bold mb-8 ${spaceGrotesk.className}`}>Members</h1>
        <div className="mb-16">
          <p className="mt-0 mb-10">
            These are the BG Media active builders and their streams. You can click on any builder to see their detailed
            contributions.
          </p>
          {isLoadingBuilderData || isLoadingBuilderEvents ? (
            <div className="m-10">
              <div className="text-5xl animate-bounce mb-2">👾</div>
              <div className="text-lg loading-dots">Loading...</div>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {allBuildersData?.map(builderData => {
                if (builderData.cap.isZero()) return;
                const cap = ethers.utils.formatEther(builderData.cap || 0);
                const unlocked = ethers.utils.formatEther(builderData.unlockedAmount || 0);
                const percentage = Math.floor((parseFloat(unlocked) / parseFloat(cap)) * 100);
                return (
                  <div className="flex flex-col" key={builderData.builderAddress}>
                    <div className="flex flex-col">
                      <div className="md:w-1/2 flex">
                        <label
                          htmlFor="withdraw-events-modal"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedAddress(builderData.builderAddress);
                          }}
                        >
                          <Address address={builderData.builderAddress} disableAddressLink={true} />
                        </label>
                      </div>
                      <div className="flex items-center gap-4">
                        <progress
                          className="progress rounded-none h-8 w-full progress-primary text-white"
                          value={percentage}
                          max="100"
                        ></progress>

                        <div>{percentage}%</div>
                      </div>
                      <div>
                        Ξ {parseFloat(unlocked).toFixed(4)} / {cap}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <StreamContractInfo />
      </div>

      <input type="checkbox" id="withdraw-modal" className="modal-toggle" />
      <label htmlFor="withdraw-modal" className="modal cursor-pointer">
        <label className="modal-box relative bg-primary shadow shadow-primary">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-8">Withdraw from your stream</h3>
          <label htmlFor="withdraw-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <div className="flex flex-col gap-6 items-center">
              <input
                type="text"
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 w-full font-medium placeholder:text-accent/50 border-2 border-base-300 bg-base-200 rounded-full text-accent"
                placeholder="Reason for withdrawing & links"
                value={reason}
                onChange={event => setReason(event.target.value)}
              />
              <EtherInput value={amount} onChange={value => setAmount(value)} />
              <button className="btn btn-secondary btn-sm" onClick={doWithdraw}>
                Withdraw
              </button>
            </div>
          </div>
        </label>
      </label>
      <input type="checkbox" id="withdraw-events-modal" className="modal-toggle" />
      <label htmlFor="withdraw-events-modal" className="modal cursor-pointer">
        <label className="modal-box relative max-w-4xl shadow shadow-primary">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-8">
            <p className="mb-1">Contributions</p>
            <Address address={selectedAddress} />
          </h3>
          <label htmlFor="withdraw-events-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <ul>
              {isWithdrawEventsLoading ? (
                <div>
                  <div className="text-4xl animate-bounce mb-2">👾</div>
                  <div className="text-lg loading-dots">Loading...</div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="flex flex-col">
                  {filteredEvents.map(event => (
                    <div key={event.id} className="flex flex-col">
                      <div>
                        <span className="font-bold">Date: </span>
                        {new Date(event.timestamp * 1000).toISOString().split("T")[0]}
                      </div>
                      <div>
                        <span className="font-bold">Amount: </span>Ξ {event.amount}
                      </div>
                      <div>{event.reason}</div>
                      <hr className="my-8" />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No contributions</p>
              )}
            </ul>
          </div>
        </label>
      </label>
    </>
  );
};

export default Members;
