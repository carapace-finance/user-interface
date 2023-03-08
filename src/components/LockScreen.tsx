import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useNetwork } from "wagmi";
import useGeoLocation from "@/hooks/useGeolocation";

const LockScreen = () => {
  const [show, setShow] = useState<string | undefined>(undefined);
  const location = useGeoLocation();

  // unsupported network
  const { chain } = useNetwork();
  useEffect(() => {
    if (!!chain) {
      chain?.unsupported ? setShow("unsupportedNetwork") : setShow(undefined);
    } else {
      setShow(undefined);
    }
  }, [chain]);

  // geo-ip
  const restrictedCountries = !!process.env.NEXT_PUBLIC_RESTRICTED_COUNTRIES
    ? process.env.NEXT_PUBLIC_RESTRICTED_COUNTRIES.split(",")
    : [];
  useEffect(() => {
    if (restrictedCountries.length === 0 || location.isLoading) return;
    if (!!location.country) {
      if (restrictedCountries.includes(location.country)) {
        setShow("unsupportedLocation");
      } else {
        setShow(undefined);
      }
    }
  }, [location]);

  const ModalContent = ({
    title,
    message
  }: {
    title: string;
    message: string | JSX.Element;
  }) => (
    <>
      <h1 className="text-customPink inline text-lg text-center">
        <AlertTriangle size={20} className="inline" />
        &nbsp;{title}
      </h1>
      <p className="text-customGrey mt-6">{message}</p>
    </>
  );

  const UnsupportedNetwork = () => (
    <ModalContent
      title="Unsupported Network"
      message="Please connect to Mainnet."
    />
  );

  const UnsupportedLocation = () => (
    <ModalContent
      title="Restricted Country"
      message={
        <p>
          Access from <br />
          <i>
            UNITED STATES, CUBA, IRAN, MYANMAR(BURMA), NORTH KOREA, SYRIA,
            AFGHANISTAN, THE REGIONS OF CRIMEA, DONETSK, OR LUHANSK
          </i>
          <br />
          is restricted.
        </p>
      }
    />
  );

  return (
    <>
      {!!show && (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-white/80 flex items-center justify-center z-40">
          <div className="bg-customPristineWhite rounded-md shadow-lg z-50 py-12 px-10 text-center max-w-lg mx-6">
            {show === "unsupportedNetwork" && <UnsupportedNetwork />}
            {show === "unsupportedLocation" && <UnsupportedLocation />}
          </div>
        </div>
      )}
    </>
  );
};

export default LockScreen;
