import MapDelivery from "../../components/map-delivery";

const MapDeliveryPage = () => {
  const coordinates = [6.244338238080621, -75.57355307042599];

  return (
    <div className="relative w-full h-screen p-[20px]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">GeoSenseWhc: Mapa de Rutas</h1>
      </div>
      <div className="relative w-full h-screen">
        <MapDelivery coords={coordinates} />
      </div>
    </div>
  );
};
export default MapDeliveryPage;
