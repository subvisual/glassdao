import { Button, Heading, EnvelopeSVG, Toast } from "@ensdomains/thorin";
import React, { useState } from "react";
import ConnectMetaMask from "./ConnectMetaMask";
import styled from "styled-components";
import Logo from "./Logo";
import Link from "next/link";
import { ethers } from "ethers";
import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { NotificationItem } from "@pushprotocol/uiweb";

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoLinkWrapper = styled.div`
  width: 150px;
`;

const NotificationsConnect = styled.span`
  display: flex;
  align-items: center;
`;

const Notifications = styled.button`
  display: flex;
  font-size: 28px;
  padding-right: 16px;
  color: rgb(56, 136, 255);
`;

function Header() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [wallet, setWallet] = useState(
    "0xD8634C39BBFd4033c0d3289C4515275102423681"
  );
  const fetchNotifications = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    const inbox = await userAlice.notification.list("INBOX", {
      account: `eip155:11155111:0x895B0bC0f28CAACDfAc33f747a2bC714edfb04Eb`,
    });

    setNotifications(inbox);
    setShowNotifications(true);
  };

  console.log(notifications);
  return (
    <Navbar>
      <Link href="/" title="Glassdao">
        <LogoLinkWrapper>
          <Logo />
        </LogoLinkWrapper>
      </Link>
      <NotificationsConnect>
        <Notifications>
          <Button colorStyle="accentSecondary" onClick={fetchNotifications}>
            <EnvelopeSVG />
          </Button>
        </Notifications>
        <ConnectMetaMask />
      </NotificationsConnect>
      {notifications.map((notifItemSingular, idx) => {
        const { title, message } =
          notifItemSingular;
        return (
          <Toast
            id={idx.toString()}
            key={idx.toString()}
            title={title}
            variant="desktop"
            open={showNotifications}
            onClose={() => setShowNotifications(false)}
          >
            {message}
          </Toast>
        );
      })}
    </Navbar>
  );
}

export default Header;
