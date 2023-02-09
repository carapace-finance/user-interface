import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import useIsMounted from "@hooks/useIsMounted";
import WalletLogo from "@components/WalletLogo";
import { Dialog, DialogContent } from "@mui/material";
import Image from "next/image";
import assets from "../assets";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ConnectWalletPopUp = ({ open, onClose }: Props) => {
  const isMounted = useIsMounted();
  const { connect, connectors } = useConnect({
    connector: new InjectedConnector()
  });
  const connectWallet = (x: any): void => {
    connect({ connector: x });
    setTimeout(() => onClose(), 150);
  };

  return (
    <Dialog
      maxWidth="md"
      disableScrollLock
      open={open}
      onClose={onClose}
      BackdropProps={{ style: { backgroundColor: "#FFFFFFE6" } }}
      PaperProps={{
        style: {
          borderRadius: "16px"
        }
      }}
    >
      <DialogContent>
        <div className="px-8">
          <Image
            src={assets.footerLogo.src}
            alt="carapace"
            width="75"
            height="51"
            className="mx-auto pt-8"
          />
          <h2 className="pt-6 pb-8 font-medium text-2xl text-center">
            Connect Wallet
          </h2>
          <div className="pb-8 px-4">
            {connectors.map((x: any) => (
              <button
                disabled={isMounted ? !x.ready : false}
                key={x.id}
                onClick={() => connectWallet(x)}
                className="btn-outline border-customPopupGrey flex w-full items-center justify-between rounded-full py-2 px-6 mb-3 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {x.name}
                {!x.ready && (
                  <span className="text-customGrey ml-2">(unsupported)</span>
                )}
                <div className="h-5">
                  <WalletLogo id={x.id} />
                </div>
              </button>
            ))}
          </div>
          <p className="text-customGrey text-sm">
            {/* TODO: add TOA link */}
            By connecting, you agree to Carapace&apos;s <a>Terms of Service</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletPopUp;
