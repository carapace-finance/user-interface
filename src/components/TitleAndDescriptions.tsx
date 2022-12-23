/* eslint-disable @next/next/no-img-element */
import assets from "src/assets";

const TitleAndDescriptions = (props) => {
  return (
    <div className="mb-16">
      <div>
        <h1 className="text-left font-bold leading-12 text-5xl mb-8">
          {props.title}
        </h1>
        <p className="text-left font-normal text-2xl leading-6">
          {props.descriptions}
        </p>
      </div>
      <div className="text-right mt-8 flex justify-end">
        {props.buttonExist ? (
          <button
            className="border rounded-md border-black px-4 py-4 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
            onClick={() => {
              window.open(props.guideLink, "_blank");
            }}
          >
            <div className="flex items-center">
              <p className="font-normal text-lg leading-6">{props.button}</p>
              <img
                className="ml-2"
                src={assets.vector.src}
                alt=""
                height="12"
                width="12"
              />
            </div>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TitleAndDescriptions;
