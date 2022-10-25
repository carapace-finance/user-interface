import { useWeb3React } from "@web3-react/core";

const Account = () => {
  const { account } = useWeb3React();
  return (
    <>
      <span>
        {account === null
          ? ""
          : account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : ""}
      </span>
    </>
  );
};

export default Account;
