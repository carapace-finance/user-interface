import Image from "next/image";
import assets from "src/assets";

const TitleAndDescriptions = (props) => {
  return (
    <div className="mb-16">
      <div>
        <h1 className="text-left font-bold leading-12 text-4xl mb-6">
          {props.title}
        </h1>
        <p className="text-left font-normal text-xl leading-6">
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
              <Image
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
