import useAPINotif from "./common/hooks/useAPINotif";
import Loader from "react-loader-spinner";

function APILoaderNotification() {
  const { isLoading } = useAPINotif();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: isLoading ? "flex" : "none",
        position: "fixed",
        top: 0,
        // backgroundColor: "#2C589A",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        opacity: 0.7,
      }}
    >
      <Loader type="Puff" visible={isLoading} color={"#f7f7f7"} />
    </div>
  );
}

export default APILoaderNotification;
