import Link from "next/link";
import ConnectMetaMask from "@/components/ConnectMetaMask";

export default function Home() {
  return (
    <div>
      <h1>Glassdao</h1>
      <div>
        <ConnectMetaMask />
      </div>
      <Link href={"/review"}>Add review</Link>
    </div>
  );
}
