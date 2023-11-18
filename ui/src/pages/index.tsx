import styled from "styled-components";
import { useUserRole } from "../hooks/useUserRole";
import { useAccount } from "wagmi";
import SelectRole from "../components/SelectRole";
import { useRouter } from "next/navigation";

export default function Home() {
  const userRole = useUserRole();
  const { isConnected } = useAccount();
  const router = useRouter();

  if (!isConnected) return null;

  if (userRole) router.push("/" + userRole);

  return (
    <main>
      <SelectRole />

      {/* <Button
        as="a"
        href="/review"
        colorStyle="background"
        shape="rounded"
        width="45"
      >
        Add review
      </Button> */}
    </main>
  );
}
