import MapDelivery from "../../components/map-delivery";

const MapDeliveryPage = () => {
  const coordinates = [6.244338238080621, -75.57355307042599];

  return (
    <div className="relative w-full p-[20px]">
      <div className="relative w-full ">
        <MapDelivery coords={coordinates} />
      </div>
    </div>
  );
};
export default MapDeliveryPage;
