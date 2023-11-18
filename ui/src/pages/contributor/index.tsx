import styled from "styled-components";
import { useAccount } from "wagmi";
import { redirect } from "next/navigation";
import { useUserRole } from "../../hooks/useUserRole";

const Main = styled.main`
  padding: 20px 40px;
`;

export default function Contributor() {
  useUserRole();

  return <Main>contributor</Main>;
}
