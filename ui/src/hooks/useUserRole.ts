import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type UserRole = "dao" | "contributor";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole | null>();
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!address) {
      if (userRole) router.push("/");

      setUserRole(undefined);
      return;
    }

    getUserRole(address).then((res) =>
      setUserRole((res as any).role as UserRole)
    );

    return () => console.log("unhook");
  }, [address]);

  return userRole;
};

const getUserRole = async (address: `0x${string}`) =>
  new Promise<{ role?: UserRole }>((res) => {
    setTimeout(() => {
      res({});
    }, 1000);
  });
