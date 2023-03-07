import { ArrowUpRight } from "lucide-react";

type Props = {
  title: string | JSX.Element;
  descriptions?: string;
  buttonExist?: boolean;
  guideLink?: string;
  button?: string;
};

const TitleAndDescriptions = (props: Props) => {
  return (
    <div className="mb-16">
      <div>
        {typeof props.title === "string" || props.title instanceof String ? (
          <h1 className="text-left font-bold leading-12 text-4xl mb-6">
            {props.title}
          </h1>
        ) : (
          props.title
        )}
        <p className="text-left font-normal text-xl leading-6 text-customGrey">
          {props.descriptions}
        </p>
      </div>
      <div className="text-right mt-6 flex justify-end">
        {props.buttonExist ? (
          <button
            className="btn-outline px-4 py-2 rounded-md"
            onClick={() => {
              window.open(props.guideLink, "_blank");
            }}
          >
            <div className="flex items-center">
              <p className="font-normal text-lg leading-6">{props.button}</p>
              <ArrowUpRight size={16} className="ml-1" />
            </div>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TitleAndDescriptions;
