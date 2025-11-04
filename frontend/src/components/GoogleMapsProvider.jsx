import { LoadScript } from "@react-google-maps/api";

const GoogleMapsProvider = ({ children }) => (
  <LoadScript
    googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
    libraries={["places"]}
  >
    {children}
  </LoadScript>
);

export default GoogleMapsProvider;
