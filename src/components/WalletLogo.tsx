import Image from "next/image";
import ImgMetamask from "../assets/wallets/metamask-fox.svg";
import ImgCoinbase from "../assets/wallets/coinbase-wallet.png";
import ImgWalletconnext from "../assets/wallets/walletconnect-circle-white.svg";

const WalletLogo = ({
  id,
  size = 24
}: {
  id: string;
  size?: number;
}): JSX.Element => {
  const WalletIcon: any = {
    metaMask: <Image src={ImgMetamask} height={size} width={size} alt={id} />,
    coinbaseWallet: (
      <Image src={ImgCoinbase} height={size} width={size} alt={id} />
    ),
    walletConnect: (
      <Image src={ImgWalletconnext} height={size} width={size} alt={id} />
    )
  };

  return <div className="flex items-center shrink-0">{WalletIcon[id]}</div>;
};

export default WalletLogo;
