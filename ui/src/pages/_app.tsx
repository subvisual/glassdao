import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ThorinGlobalStyles, lightTheme } from "@ensdomains/thorin";
import { ThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components";
import Header from "@/components/Header";
import Layout from "@/components/AppLayout";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
});

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Satoshi Bold";
    font-style: normal;
    font-weight: 700;
    src: url("/assets/fonts/Satoshi-Bold.otf") format("opentype");
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted();

  return (
    <WagmiConfig config={config}>
      <ThemeProvider theme={lightTheme}>
        <ThorinGlobalStyles />
        <GlobalStyle />
        {isMounted && (
          <Layout>
            <Header />
            <Component {...pageProps} />
          </Layout>
        )}
      </ThemeProvider>
    </WagmiConfig>
  );
}
