import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ThorinGlobalStyles, lightTheme } from "@ensdomains/thorin";
import { ThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components";
import Header from "@/components/Header";
import Layout from "@/components/AppLayout";
import Head from "next/head";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
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
    <>
      <Head>
        <title>GlassDAO - A magnifying glass for DAOs</title>
        <meta
          name="description"
          content="A platform designed for people to access anonymous reviews of DAOs and view a trustworthy list of their contributors."
        />
        <meta
          name="description"
          content="A platform designed for people to access anonymous reviews of DAOs and view a trustworthy list of their contributors."
        />

        <meta
          property="og:title"
          content="GlassDAO - A magnifying glass for DAOs"
        />
        <meta property="og:url" content="https://glassdao.vercel.app/" />
        <meta
          property="og:image"
          content="https://glassdao.vercel.app/cover.png"
        />

        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
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
    </>
  );
}
