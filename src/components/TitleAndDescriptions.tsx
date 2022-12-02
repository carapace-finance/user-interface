const TitleAndDescriptions = (props) => {
  return (
    <div>
      <h1 className="text-left">{props.title}</h1>
      <p className="text-left">{props.descriptions}</p>
      <div className="text-right">
        {props.buttonExist ? (
          <button
            className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
            onClick={() => {}}
          >
            <p>{props.button}</p>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TitleAndDescriptions;
