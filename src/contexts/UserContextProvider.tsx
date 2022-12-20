import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef
} from "react";
import { User, UserContextType } from "@type/types";
import { BigNumber } from "ethers";
import { ApplicationContext } from "./ApplicationContextProvider";
import numeral from "numeral";
import { convertUSDCToNumber, getUsdcBalance, USDC_FORMAT } from "@utils/usdc";
import { ProtectionPoolContext } from "./ProtectionPoolContextProvider";
import { getPoolContract } from "@contracts/contractService";

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({ children }) => {
  const defaultUser: User = {
    address: "0xTestUser", //"0x008c84421da5527f462886cec43d2717b686a7e4",
    ETHBalance: "0",
    USDCBalance: BigNumber.from(0),
    sTokenUnderlyingAmount: "0",
    requestedWithdrawalAmount: "0",
    protectionAmount: "0",
    protectionDuration: "0",
    protectionPurchases: []
  };

  const { protectionPoolService, provider } = useContext(ApplicationContext);
  const { protectionPools, isDefaultData } = useContext(ProtectionPoolContext);
  const [user, setUser] = useState<User>(defaultUser);
  const userRef = useRef<User>(user);

  const updateSTokenUnderlyingAmount = async (poolAddress) => {
    if (!protectionPoolService || !poolAddress) {
      return;
    }

    const sTokenUnderlyingBalance =
      await protectionPoolService.getSTokenUnderlyingBalance(poolAddress);
    const formattedUnderlyingBalance = numeral(
      convertUSDCToNumber(sTokenUnderlyingBalance)
    ).format(USDC_FORMAT);
    userRef.current.sTokenUnderlyingAmount = formattedUnderlyingBalance;
    setUser({
      ...userRef.current
    });
    
    console.log(
      "User's sTokenUnderlyingBalance Updated ==>",
      formattedUnderlyingBalance
    );
  };

  const updateRequestedWithdrawalAmount = async (poolAddress) => {
    if (!protectionPoolService || !poolAddress) {
      return;
    }

    const requestedWithdrawalBalance =
      await protectionPoolService.getRequestedWithdrawalAmount(poolAddress);
    const formattedWithdrawalBalance = numeral(
      convertUSDCToNumber(requestedWithdrawalBalance)
    ).format(USDC_FORMAT);
    userRef.current.requestedWithdrawalAmount = formattedWithdrawalBalance;
    setUser({
      ...userRef.current
    });

    console.log(
      "User's (%s) requestedWithdrawalAmount updated: %s",
      user.address,
      formattedWithdrawalBalance
    );
  };

  /**
   * Updates the user's USDC balance and update the user state using userRef.current
   * @returns
   */
  const updateUserUsdcBalance = async () => {
    let newUsdcBalance = await getUsdcBalance(provider, user.address);
    if (newUsdcBalance != user.USDCBalance) {
      userRef.current.USDCBalance = newUsdcBalance;
      setUser({
        ...userRef.current
      });
    }

    return newUsdcBalance;
  };

  useEffect(() => {
    if (provider) {
      provider
        .getSigner()
        .getAddress()
        .then((address) => {
          userRef.current.address = address;
          setUser(userRef.current);
        });
    }
  }, [provider]);

  useEffect(() => {
    if (protectionPoolService && protectionPools && !isDefaultData) {
      protectionPools.map((protectionPool) => {
        const poolAddress = protectionPool.address;
        (async () => {
          const protectionPurchases =
            await protectionPoolService.getProtectionPurchases(poolAddress);
          console.log(
            "Retrieved Protection Purchases ==>",
            protectionPurchases
          );

          // update user's address & protection purchases
          // userRef.current.address = await provider.getSigner().getAddress();
          userRef.current.protectionPurchases = protectionPurchases;

          await updateSTokenUnderlyingAmount(poolAddress);
          await updateRequestedWithdrawalAmount(poolAddress);
          await updateUserUsdcBalance();
          setUser(userRef.current);
        })();

        const poolInstance = getPoolContract(poolAddress, provider.getSigner());

        // Listen for ProtectionSold/deposit by user
        poolInstance.on(
          "ProtectionSold",
          async (userAddress, amount, event) => {
            console.log("ProtectionSold event triggered: ", event);

            if (userAddress === user.address) {
              console.log("User made a deposit!");
              await updateSTokenUnderlyingAmount(poolAddress);
              await updateUserUsdcBalance();
            }
          }
        );

        // Listen for WithdrawalMade by user
        poolInstance.on(
          "WithdrawalMade",
          async (userAddress, amount, receiver, event) => {
            console.log("WithdrawalMade event triggered: ", event);

            if (receiver === user.address) {
              console.log("User made a withdrawal!");
              await updateSTokenUnderlyingAmount(poolAddress);
              await updateRequestedWithdrawalAmount(poolAddress);
              await updateUserUsdcBalance();
            }
          }
        );
      });
    } else {
      setUser(defaultUser);
    }
  }, [protectionPools, isDefaultData, protectionPoolService]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUserUsdcBalance
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
