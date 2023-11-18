import { useAccount, useConnect, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Button } from "@ensdomains/thorin";
import { Spinner } from "@ensdomains/thorin";

export default function ConnectMetaMask() {
  const { connect, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const connector = new MetaMaskConnector();

  if (isConnected) {
    return (
      <Button onClick={() => disconnect()} shape="rounded" width="40">
        {address}
      </Button>
    );
  }

  return (
    connector && (
      <Button
        disabled={!connector.ready}
        onClick={() => connect({ connector })}
        shape="rounded"
        width="45"
      >
        {isLoading ? <Spinner /> : "Connect"}
      </Button>
    )
  );
}
