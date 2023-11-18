import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Button, Card, Profile } from "@ensdomains/thorin";
import { WalletSVG } from "@ensdomains/thorin";
import { useEffect } from "react";

export default function ConnectMetaMask() {
  const { connect, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const connector = new MetaMaskConnector();

  if (isConnected && address) {
    return (
      <Profile
        address={address!}
        ensName={ensName || address}
        onClick={() => disconnect()}
      />
    );
  }

  return (
    connector && (
      <Button
        disabled={!connector.ready}
        loading={isLoading}
        onClick={() => connect({ connector })}
        shape="rounded"
        width="45"
        prefix={<WalletSVG />}
      >
        Connect
      </Button>
    )
  );
}
