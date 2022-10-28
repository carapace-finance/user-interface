const TitleAndDescriptions = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.descriptions}</p>
      {props.buttonExist ? (
        <button
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={() => {}}
        >
          <p>{props.button}</p>
        </button>
      ) : null}
    </div>
  );
};

export default TitleAndDescriptions;
