import { Button, Heading } from "@ensdomains/thorin";
import React from "react";
import ConnectMetaMask from "./ConnectMetaMask";
import styled from "styled-components";

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
`;

function Header() {
  return (
    <Navbar>
      <Heading>GlassDAO</Heading>
      <ConnectMetaMask />
    </Navbar>
  );
}

export default Header;
