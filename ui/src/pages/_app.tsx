import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ThorinGlobalStyles, lightTheme } from "@ensdomains/thorin";
import { ThemeProvider } from "styled-components";

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
      <ThemeProvider theme={lightTheme}>
        <ThorinGlobalStyles />
        {isMounted && <Component {...pageProps} />}
      </ThemeProvider>
    </WagmiConfig>
  );
}
