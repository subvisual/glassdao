import { ReactNode } from "react";
import styled from "styled-components";

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 30px;
`;

function AppLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}

export default AppLayout;
