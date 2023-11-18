import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useIsMounted } from "@/hooks/useIsMounted";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted();

  return (
    <WagmiConfig config={config}>
      {isMounted && <Component {...pageProps} />}
    </WagmiConfig>
  );
}
