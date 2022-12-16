import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Tooltip } from "@material-tailwind/react";
import BuyProtectionPopUp from "./BuyProtectionPopUp";
import { useRouter } from "next/router";
import numeral from "numeral";
import { convertNumberToUSDC, convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { getDaysInSeconds } from "@utils/utils";
import { BuyProtectionInputs } from "@type/types"

export default function BuyProtectionCard() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<BuyProtectionInputs>({ defaultValues: { protectionAmount: 0, protectionDurationInDays: 50 } });

  const [isOpen, setIsOpen] = useState(false);
  const [tokenId, setTokenId] = useState(590);
  const [premiumPrice, setPremiumPrice] = useState(1024);
  const [calculatingPremiumPrice, setCalculatingPremiumPrice] = useState(false);

  const { contractAddresses, protectionPoolService } =
    useContext(ApplicationContext);

  const router = useRouter();

  useEffect(() => {
    if (protectionPoolService && contractAddresses.premiumCalculator && getValues("protectionAmount") > 0 && getValues("protectionDurationInDays") > 0) {
      setCalculatingPremiumPrice(true);
      const protectionPurchaseParams = {
        lendingPoolAddress: router.query.address as string,
        nftLpTokenId: tokenId,
        protectionAmount: convertNumberToUSDC(getValues("protectionAmount")),
        protectionDurationInSeconds: getDaysInSeconds(getValues("protectionDurationInDays"))
      };
      console.log("Calculating premium price for Protection purchase params: ", protectionPurchaseParams);
      protectionPoolService
        .calculatePremiumPrice(router.query.protectionPoolAddress as string, contractAddresses.premiumCalculator, protectionPurchaseParams)
        .then((price) => {
          console.log("Setting premium price: ", price);
          setPremiumPrice(convertUSDCToNumber(price));
          setCalculatingPremiumPrice(false);
        });
    }
  }, [protectionPoolService, getValues("protectionAmount"), getValues("protectionDurationInDays"), tokenId]);

  const onSubmit = () => {
    setIsOpen(true);
  }; // your form submit function which will invoke after successful validation

  return (
    <div className="block py-10 px-6 bg-white rounded-2xl shadow-boxShadow  shadow-table w-450 mr-32">
      <h5 className="text-left text-customGrey text-xl leading-tight font-normal mb-2 flex items-center">
        Estimated Adjusted Yields
        <div className="pl-2">
          <Tooltip
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
              content="Lending Pool APY % minus Premium %"
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
      </h5>
      <div className="py-2 border-b border-gray-300">
       <h1 className="text-customDarkGrey text-4xl mb-4 text-left">7 - 10%</h1>
      </div>
      <div className="my-4">
        <div className="flex mb-4">
          <div>
            <h5 className="text-customGrey text-base flex mb-2 ">
              Lending Pool APY
              <Tooltip
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                  content="APY in an underlying lending protocol like Goldfinch."
                  placement="top"
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </Tooltip>
            </h5>
            <p className="text-left text-xl">17%</p>
          </div>
          <div className="ml-14">
            <h5 className="text-customGrey text-left text-base mb-2">Premium</h5>
            <p className="text-left text-xl">7% - 10%</p>
          </div>
        </div>
        <div className="flex">
          <div>
            <h5 className="text-customGrey text-base mb-2">CARA Token Rewards</h5>
            <p className="text-left text-xl">~3.5%</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <div>
          <div className="mb-4">
            <h5 className="text-left text-customGrey text-xl leading-tight font-normal mb-4">Protection Amount</h5>
            <div>
              <input 
                className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
                type="number"
                {...register("protectionAmount", { min: 1, max: 10000000, required: true })} // todo: add the leverage ratio limit to max
              />
              {errors.protectionAmount && (
                <h5 className="block text-left text-buttonPink text-xl leading-tight font-normal mb-4">the protection amount must be in between 0 and the available protection purchase amount</h5>
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
          <h5 className="text-left text-customGrey text-xl leading-tight font-normal mb-4">Protection Duration (days)</h5>
          <div>
            <input 
              className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
              type="number"
              {...register("protectionDurationInDays", { min: 1, max: 180, required: true })} 
            />
            {errors.protectionDurationInDays && (
              <h5 className="block text-left text-buttonPink text-xl leading-tight font-normal mb-4">the protection duration must be in between 0 day and the next cycle end(180 days the longest)</h5>
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
        <h5 className="text-left text-customGrey text-xl leading-tight font-normal mb-4">Goldfinch Token ID</h5>
        <div className="flex w-72 flex-col gap-4">
          {/* <Input
            label="Goldfinch Token ID"
            value={tokenId}
            type="number"
            onChange={(e) =>
              e.target.value ? setTokenId(parseInt(e.target.value)) : 0
            }
          /> */}
          <p className="text-left text-xl">{tokenId}</p>
        </div>
      </div>
      <h5 className="text-left text-customGrey text-xl leading-tight font-normal mb-4">Premium Price</h5>
      <p className="text-left text-xl">{calculatingPremiumPrice ? "Calculating Premium Price..." : numeral(premiumPrice).format(USDC_FORMAT) + " USDC"}</p>
      <input
        type="submit"
        value="Preview"
        className="border border-customDarkGrey text-customDarkGrey rounded-md px-16 py-5 mb-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline disabled:opacity-50"
        disabled={
          premiumPrice === 0 ||
          calculatingPremiumPrice
        }
      />
      </form>
      <p>Buy protection within: 2 days 12 hours 34 mins</p>
      <BuyProtectionPopUp
        open={isOpen}
        onClose={() => setIsOpen(false)}
        protectionAmount={getValues("protectionAmount")}
        protectionDurationInDays={getValues("protectionDurationInDays")}
        tokenId={tokenId}
        premiumAmount={premiumPrice}
        lendingPoolAddress={router.query.address}
        protectionPoolAddress={router.query.protectionPoolAddress}
      ></BuyProtectionPopUp>
    </div>
  );
}
