import styled from "styled-components";
import { useAccount } from "wagmi";
import { redirect } from "next/navigation";
import { useUserRole } from "../../hooks/useUserRole";

export default function Contributor() {
  useUserRole();

  return <>contributor</>;
}
