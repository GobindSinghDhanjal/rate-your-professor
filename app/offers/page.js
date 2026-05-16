import GoogleAd from "../components/GoogleAd/GoogleAd";

export const metadata = {
  title: "Offers",
};

const page = () => {
  return (
    <div className="container">
      <div
        className="sub-container"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <h1>We will soon upload student offers</h1>
      </div>
      <GoogleAd />
    </div>
  );
};

export default page;
