/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import assets from "src/assets";

const TitleAndDescriptions = (props) => {
  return (
    <div className="mb-16">
      <div>
        <h1 className="text-left font-bold leading-12 text-5xl mb-6">{props.title}</h1>
        <p className="text-left font-normal text-2xl leading-6">{props.descriptions}</p>
      </div>
      <div className="text-right flex justify-end">
        {props.buttonExist ? (
          <button
            className="border rounded-md border-black px-4 py-4 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
            onClick={() => {}}
          >
            <div className="flex items-center">
             <p className="font-normal text-lg leading-6">{props.button}</p>
             <Link href="/" className="ml-2">
                <img
                  src={assets.vector.src}
                  alt=""
                  height="12"
                  width="12"
                />
              </Link>
            </div>

          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TitleAndDescriptions;
