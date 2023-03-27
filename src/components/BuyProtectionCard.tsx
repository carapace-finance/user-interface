import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Tooltip } from "@material-tailwind/react";
import BuyProtectionPopUp from "./BuyProtectionPopUp";
import { useRouter } from "next/router";
import { protocolParameters } from "@constants/index";
import { convertNumberToUSDC, convertUSDCToNumber } from "@utils/usdc";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { getDaysInSeconds } from "@utils/utils";
import { BuyProtectionInputs } from "@type/types";
import { isAddress } from "ethers/lib/utils";
import { Info } from "lucide-react";

export default function BuyProtectionCard(props) {
  const { adjustedYields, lendingPoolAPY, premium, timeLeft, name } = props;
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<BuyProtectionInputs>({
    defaultValues: { protectionAmount: "0", protectionDurationInDays: "50" }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [tokenId, setTokenId] = useState(590);
  const [premiumPrice, setPremiumPrice] = useState(1024);
  const [calculatingPremiumPrice, setCalculatingPremiumPrice] = useState(false);

  const { contractAddresses, protectionPoolService } =
    useContext(ApplicationContext);

  const router = useRouter();
  const protectionPoolAddress = router.query.protectionPoolAddress as string;
  const lendingPoolAddress = router.query.address as string;

  const onSubmit = () => {
    calculatePremium();
    setIsOpen(true);
  }; // your form submit function which will invoke after successful validation

  const calculatePremium = () => {
    const protectionAmount = parseFloat(getValues("protectionAmount"));
    const protectionDurationInDays = parseFloat(
      getValues("protectionDurationInDays")
    );

    if (
      protectionPoolService &&
      isAddress(contractAddresses?.premiumCalculator) &&
      isAddress(protectionPoolAddress) &&
      protectionAmount > 0 &&
      protectionDurationInDays > 0
    ) {
      setCalculatingPremiumPrice(true);
      const protectionPurchaseParams = {
        lendingPoolAddress: lendingPoolAddress,
        nftLpTokenId: tokenId,
        protectionAmount: convertNumberToUSDC(protectionAmount),
        protectionDurationInSeconds: getDaysInSeconds(protectionDurationInDays)
      };
      console.log(
        "Calculating premium price for Protection purchase params: ",
        protectionPurchaseParams
      );
      protectionPoolService
        .calculatePremiumPrice(
          protectionPoolAddress,
          contractAddresses.premiumCalculator,
          protectionPurchaseParams
        )
        .then((price) => {
          console.log("Setting premium price: ", price);
          setPremiumPrice(convertUSDCToNumber(price));
          setCalculatingPremiumPrice(false);
        });
    }
  };

  return (
    <div className="block py-6 md:py-10 px-4 md:px-8 rounded-2xl shadow-card shadow-gray-200 w-full lg:w-450 h-fit">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <div>
            <p className="inline text-customGrey text-sm md:text-base">
              Your Backer Token Id in Goldfinch
              <Info size={15} className="inline ml-1" />
            </p>
            <p>173</p>
            <div className="mb-4 mt-4">
              <label className="text-left text-customGrey text-sm md:text-base leading-tight font-normal mb-4">
                Protection Amount
              </label>
              <div>
                <input
                  className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
                  type="number"
                  {...register("protectionAmount", {
                    min: 1,
                    max: 71000,
                    required: true
                  })} // todo: add the leverage ratio limit to max
                  onWheel={(e: any) => e.target.blur()}
                />
                {errors.protectionAmount && (
                  <h5 className="block text-left text-customPink text-xs md:text-xl leading-tight font-normal mb-4">
                    the protection amount must be in between 0 and the available
                    protection purchase amount
                  </h5>
                )}
                {/* <Input
                  label="Protection Amount"
                  value={protectionAmount}
                  type="number"
                  onChange={(e) =>
                    e.target.value ? setProtectionAmount(parseFloat(e.target.value)) : 0
                  }
                />
                <Input
                  label="Protection Amount"
                  value={protectionAmount}
                  type="number"
                  onChange={(e) =>
                    e.target.value ? setProtectionAmount(parseFloat(e.target.value)) : 0
                  }
                /> */}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-left text-customGrey leading-tight text-sm md:text-base font-normal mb-4">
              Protection Duration (days)
            </label>
            <div>
              <input
                className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
                type="number"
                {...register("protectionDurationInDays", {
                  min: protocolParameters.minProtectionDurationInDays,
                  max: protocolParameters.cycleDurationInDays,
                  required: true
                })}
                onWheel={(e: any) => e.target.blur()}
              />
              {errors.protectionDurationInDays && (
                <h5 className="block text-left text-customPink text-xs md:text-xl leading-tight font-normal mb-4">
                  the protection duration must be between 30 to 90 days
                </h5>
              )}
              {/* <Input
              label="Protection Duration (days)"
              value={protectionDurationInDays}
              type="number"
              onChange={(e) =>
                e.target.value
                  ? setProtectionDurationInDays(parseInt(e.target.value))
                  : 0
              }
            /> */}
            </div>
          </div>
          {/* <h5 className="text-left text-customGrey text-xl leading-tight font-normal mb-2 flex items-center">
            Goldfinch Token ID
            <div className="pl-2">
              <Tooltip
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
                content="ID of your LP token in Goldfinch"
                placement="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </Tooltip>
            </div>
          </h5> */}
          {/* <div className="flex w-72 flex-col gap-4"> */}
          {/* <Input
            label="Goldfinch Token ID"
            value={tokenId}
            type="number"
            onChange={(e) =>
              e.target.value ? setTokenId(parseInt(e.target.value)) : 0
            }
          /> */}
          {/* <p className="text-left text-xl">{tokenId}</p> */}
          {/* </div> */}
        </div>
        <input
          className="text-white bg-customBlue rounded-md w-full md:w-fit px-14 py-3 md:py-4 mt-4 md:mt-8 mb-4 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          value="Buy Protection"
          disabled={!protectionPoolAddress} // todo: add the leverage ratio limit
        />
      </form>
      <div className="flex flex-row justify-start items-center">
        <p className="mr-2 md:mr-4 text-sm md:text-base">
          Buy protection within: {timeLeft}
        </p>
        <Tooltip
          content="Time left to buy protection for this lending pool"
          placement="top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#6E7191"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </Tooltip>
      </div>
      <BuyProtectionPopUp
        open={isOpen}
        onClose={() => setIsOpen(false)}
        protectionAmount={getValues("protectionAmount")}
        protectionDurationInDays={getValues("protectionDurationInDays")}
        tokenId={tokenId}
        premiumAmount={premiumPrice}
        calculatingPremiumPrice={calculatingPremiumPrice}
        setPremiumPrice={setPremiumPrice}
        lendingPoolAddress={lendingPoolAddress}
        protectionPoolAddress={protectionPoolAddress}
        name={name}
        adjustedYields={adjustedYields}
      />
    </div>
  );
}
