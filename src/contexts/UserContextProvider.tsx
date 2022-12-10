import React, { useState, createContext } from "react";
import { User, UserContextType } from "@type/types";
import { BigNumber } from "ethers";

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({ children }) => {
  const defaultUser: User = {
    address: "0x008c84421da5527f462886cec43d2717b686a7e4",
    ETHBalance: "0",
    USDCBalance: BigNumber.from(0),
    sTokenUnderlyingAmount: "0",
    requestedWithdrawalAmount: "0",
    protectionAmount: "0",
    protectionDuration: "0"
  };

  const [user, setUser] = useState<User>(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
