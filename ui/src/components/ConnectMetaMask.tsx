import { useAccount, useConnect, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function ConnectMetaMask() {
  const { connect, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const connector = new MetaMaskConnector();

  if (isConnected) {
    return <button onClick={() => disconnect()}>{address}</button>;
  }

  return (
    connector && (
      <button
        disabled={!connector.ready}
        onClick={() => connect({ connector })}
      >
        {isLoading ? " Connecting..." : "Connect"}
      </button>
    )
  );
}
