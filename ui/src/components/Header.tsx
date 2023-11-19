import { Button, Heading } from "@ensdomains/thorin";
import React from "react";
import ConnectMetaMask from "./ConnectMetaMask";
import styled from "styled-components";
import Logo from "./Logo";
import Link from "next/link";

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoLinkWrapper = styled.div`
  width: 150px;
`;

function Header() {
  return (
    <Navbar>
      <Link href="/" title="Glassdao">
        <LogoLinkWrapper>
          <Logo />
        </LogoLinkWrapper>
      </Link>
      <ConnectMetaMask />
    </Navbar>
  );
}

export default Header;
