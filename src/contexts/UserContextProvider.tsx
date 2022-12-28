import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef
} from "react";
import { User, UserContextType, UserLendingPool } from "@type/types";
import { BigNumber } from "ethers";
import { ApplicationContext } from "./ApplicationContextProvider";
import numeral from "numeral";
import { convertUSDCToNumber, getUsdcBalance, USDC_FORMAT } from "@utils/usdc";
import { LendingPoolContext } from "./LendingPoolContextProvider";
import { ProtectionPoolContext } from "./ProtectionPoolContextProvider";
import { getProtectionPoolContract } from "@contracts/contractService";

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({ children }) => {
  // todo: make requested withdrawal amount in each cycle in a given protection pool
  // todo: list up more than one protection purchase per lending pool
  const defaultUser: User = {
    address: "0xTestUser", //"0x008c84421da5527f462886cec43d2717b686a7e4",
    ETHBalance: "0",
    USDCBalance: BigNumber.from(0),
    // todo: make protection pool array of object
    userProtectionPools: [],
    sTokenUnderlyingAmount: "51,000.00",
    requestedWithdrawalAmount: "10,000.00",
    // todo: make lending pool array of object
    userLendingPools: [
      {
        lendingPoolAddress: "0xb26B42Dd5771689D0a7faEea32825ff9710b9c11",
        protectionPremium: BigNumber.from(0xbf4c5737),
        expirationTimestamp: BigNumber.from(0x63ccd0ee), // todo: make this value dynamic
        protectionAmount: BigNumber.from(0x22ecb25c00)
      }
    ]
  };

  const { protectionPoolService, provider } = useContext(ApplicationContext);
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools, isDefaultData } = useContext(ProtectionPoolContext);
  const [user, setUser] = useState<User>(defaultUser);
  const userRef = useRef<User>(user);

  const updateSTokenUnderlyingAmount = async (protectionPoolAddress) => {
    if (!protectionPoolService || !protectionPoolAddress) {
      return;
    }

    const sTokenUnderlyingBalance =
      await protectionPoolService.getSTokenUnderlyingBalance(
        protectionPoolAddress
      );
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

  const updateRequestedWithdrawalAmount = async (protectionPoolAddress) => {
    if (!protectionPoolService || !protectionPoolAddress) {
      return;
    }

    const requestedWithdrawalBalance =
      await protectionPoolService.getRequestedWithdrawalAmount(
        protectionPoolAddress
      );
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

  const updatePurchasedProtectionDetails = async (
    protectionPoolAddress: string,
    lendingPoolAddress: string
  ) => {
    if (protectionPoolService || protectionPoolAddress || lendingPoolAddress) {
      const protectionInfos =
        await protectionPoolService.getProtectionPurchases(
          protectionPoolAddress
        );

      // todo: this needs to be added in the mainnet
      // let filteredProtectionInfos;
      // if (protectionInfos?.length > 0) {
      //   filteredProtectionInfos = protectionInfos.filter(
      //     (protectionInfo) =>
      //       protectionInfo.purchaseParams.lendingPoolAddress ==
      //       lendingPoolAddress
      //   );
      // }
      // console.log('filteredProtectionInfos ==>', filteredProtectionInfos);

      let newUserLendingPools: UserLendingPool[] = [];
      if (protectionInfos?.length > 0) {
        newUserLendingPools = protectionInfos.map((protectionInfo) => {
          let expirationTimestamp = protectionInfo.startTimestamp.add(
            protectionInfo.purchaseParams.protectionDurationInSeconds
          );

          // todo: the startTimestamp is wrong because we advances time
          // todo: movePoolCycle moves 31 days and it's called twice, and thus 62 days need to be subtracted
          if (
            !protectionInfo.purchaseParams.protectionAmount.eq(0x22ecb25c00)
          ) {
            expirationTimestamp = expirationTimestamp.sub(62 * 86400);
          }
          const newUserLendingPool: UserLendingPool = {
            lendingPoolAddress:
              protectionInfo.purchaseParams.lendingPoolAddress,
            protectionPremium: BigNumber.from(protectionInfo.protectionPremium),
            expirationTimestamp: expirationTimestamp,
            protectionAmount: protectionInfo.purchaseParams.protectionAmount
          };
          return newUserLendingPool;
        });
      }
      console.log("newUserLendingPools ==>", newUserLendingPools);

      if (newUserLendingPools.length != 0) {
        userRef.current.userLendingPools = newUserLendingPools;
        setUser({
          ...userRef.current
        });
        console.log(
          "User's Purchased Protection Details Updated ==>",
          newUserLendingPools
        );
      }
    }
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
    let protectionPoolSubscriptions;
    if (
      protectionPoolService &&
      protectionPools &&
      lendingPools &&
      !isDefaultData
    ) {
      protectionPoolSubscriptions = protectionPools.map((protectionPool) => {
        const protectionPoolAddress = protectionPool.address;
        (async () => {
          // update user's address & protection purchases
          // userRef.current.address = await provider.getSigner().getAddress();

          if (lendingPools?.length > 0) {
            lendingPools.map(async (lendingPool) => {
              await updatePurchasedProtectionDetails(
                protectionPoolAddress,
                lendingPool.address
              );
            });
          }
          await updateSTokenUnderlyingAmount(protectionPoolAddress);
          await updateRequestedWithdrawalAmount(protectionPoolAddress);
          await updateUserUsdcBalance();
          setUser(userRef.current);
        })();

        const protectionPoolInstance = getProtectionPoolContract(
          protectionPoolAddress,
          provider.getSigner()
        );

        // Listen for "ProtectionBought", by user
        const updateDataOnProtectionBought = async (
          buyer,
          lendingPoolAddress,
          protectionAmount,
          premium
        ) => {
          console.log("ProtectionBought event triggered");

          // todo: this condition should be added in the mainnet
          // if (buyer === user.address) {
          console.log("User bought protection!");
          await updatePurchasedProtectionDetails(
            protectionPoolAddress,
            lendingPoolAddress
          );
        };
        protectionPoolInstance.on(
          "ProtectionBought",
          updateDataOnProtectionBought
        );

        // Listen for ProtectionSold/deposit by user
        const updateDataOnProtectionSold = async (
          userAddress,
          amount,
          event
        ) => {
          console.log("ProtectionSold event triggered: ", event);

          if (userAddress === user.address) {
            console.log("User made a deposit!");
            await updateSTokenUnderlyingAmount(protectionPoolAddress);
            await updateUserUsdcBalance();
          }
        };
        protectionPoolInstance.on("ProtectionSold", updateDataOnProtectionSold);

        // Listen for WithdrawalMade by user
        const updateDataOnWithdrawalMade = async (
          userAddress,
          amount,
          receiver,
          event
        ) => {
          console.log("WithdrawalMade event triggered: ", event);

          if (receiver === user.address) {
            console.log("User made a withdrawal!");
            await updateSTokenUnderlyingAmount(protectionPoolAddress);
            await updateRequestedWithdrawalAmount(protectionPoolAddress);
            await updateUserUsdcBalance();
          }
        };
        protectionPoolInstance.on("WithdrawalMade", updateDataOnWithdrawalMade);

        console.log(
          "Subscribed to ProtectionPool events: ",
          protectionPoolAddress
        );
        return [
          protectionPoolInstance,
          updateDataOnProtectionBought,
          updateDataOnProtectionSold,
          updateDataOnWithdrawalMade
        ];
      });
    } else {
      setUser(defaultUser);
    }

    return () => {
      if (!protectionPoolSubscriptions) return;
      protectionPoolSubscriptions.forEach((subscriptionDetails) => {
        if (subscriptionDetails.length != 4) return;
        const protectionPoolInstance = subscriptionDetails[0];
        const updateDataOnProtectionBought = subscriptionDetails[1];
        const updateDataOnProtectionSold = subscriptionDetails[2];
        const updateDataOnWithdrawalMade = subscriptionDetails[3];

        protectionPoolInstance.off(
          "ProtectionBought",
          updateDataOnProtectionBought
        );
        protectionPoolInstance.off(
          "ProtectionSold",
          updateDataOnProtectionSold
        );
        protectionPoolInstance.off(
          "WithdrawalMade",
          updateDataOnWithdrawalMade
        );

        console.log(
          "Unsubscribed from ProtectionPool events: ",
          protectionPoolInstance.address
        );
      });
    };
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
