import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useNetwork } from "wagmi";

const LockScreen = () => {
  const [show, setShow] = useState<string | undefined>(undefined);

  // unsupported network
  const { chain } = useNetwork();
  useEffect(() => {
    if (!!chain) {
      chain?.unsupported ? setShow("unsuported") : setShow(undefined);
    } else {
      setShow(undefined);
    }
  }, [chain]);

  const ModalContent = ({
    title,
    message
  }: {
    title: string;
    message: string;
  }) => (
    <>
      <h1 className="text-customPink flex items-center text-lg mb-4">
        <AlertTriangle size={20} />
        &nbsp;{title}
      </h1>
      <p className="text-customGrey">{message}</p>
    </>
  );

  const UnsupportedNetwork = () => (
    <ModalContent
      title="Unsupported Network"
      message="Please connect Mainnet."
    />
  );

  return (
    <>
      {!!show && (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-white/80 flex items-center justify-center z-40">
          <div className="bg-customPristineWhite rounded-md shadow-lg z-50 py-12 px-10 text-center">
            {show === "unsupported" && <UnsupportedNetwork />}
          </div>
        </div>
      )}
    </>
  );
};

export default LockScreen;
