const Loading = ({
  text = "Loading...",
}) => {
  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
        color: "#697386",
      }}
    >
      {text}
    </div>
  );
};

export default Loading;