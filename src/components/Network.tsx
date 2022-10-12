import { Button } from "@material-ui/core";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";

const Network = () => {
  const { active, error } = useWeb3React();
  const { chainId } = useWeb3React();
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);

  return (
    <Button
      color="primary"
      onClick={() => setConnectWalletOpen(true)}
      variant="outlined"
    >
      <span>{chainId === 1 ? "Mainnet" : "Testnet"}</span>
      <span>{active ? "🟢" : error ? "🔴" : "🟠"}</span>
      Connect Wallet
    </Button>
  );
};

export default Network;
