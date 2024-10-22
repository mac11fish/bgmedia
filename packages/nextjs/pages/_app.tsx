import { useEffect } from "react";
import type { AppProps } from "next/app";
// import { Space_Mono } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { Client, Provider as URQLProvider, cacheExchange, fetchExchange } from "urql";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useEthPrice } from "~~/hooks/scaffold-eth";
import { useAppStore } from "~~/services/store/store";
import { wagmiClient } from "~~/services/web3/wagmiClient";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: "400" });
// const spaceMono = Space_Mono({ subsets: ["latin"], weight: "400" });

const urqlClient = new Client({
  url: "https://bg-ponder-indexer-production.up.railway.app/",
  exchanges: [cacheExchange, fetchExchange],
});

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useEthPrice();
  const setEthPrice = useAppStore(state => state.setEthPrice);

  useEffect(() => {
    if (price > 0) {
      setEthPrice(price);
    }
  }, [setEthPrice, price]);

  return (
    <WagmiConfig client={wagmiClient}>
      <NextNProgress color="#ffffff" />
      <URQLProvider value={urqlClient}>
        <RainbowKitProvider chains={appChains.chains} avatar={BlockieAvatar}>
          <div className={`flex flex-col min-h-screen ${spaceGrotesk.className}`}>
            <Header />
            <main className="relative flex flex-col flex-1">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
          <Toaster />
        </RainbowKitProvider>
      </URQLProvider>
    </WagmiConfig>
  );
};

export default ScaffoldEthApp;
