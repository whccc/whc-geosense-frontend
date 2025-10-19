import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Map, Marker, Popup } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import debounce from "lodash.debounce";
import SpaceBackground from "../space";
import useWeather from "../../hooks/useWeather";

interface WeatherMapProps {
  coords: Array<number>;
}
const MapDelivery = ({ coords }: WeatherMapProps) => {
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [suggestions, setSuggestions] = useState<
    { name: string; coordinates: [number, number] }[]
  >([]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerARef = useRef<Marker | null>(null);
  const markerBRef = useRef<Marker | null>(null);
  const [markersReady, setMarkersReady] = useState(false);
  const dataRouteGeoJsonRef = useRef<any>([]);
  const [initLoadingRoute, setInitLoadingRoute] = useState(false);
  const [textRouteStep, setTextRouteStep] = useState("");
  const [calculateRouteReady, setCalculateRouteReady] = useState(false);
  const { getRouteGeoJSON, getAddressCoordinatesAutocomplete } = useWeather();
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

  const debouncedFetch = useRef(
    debounce(async (query: string) => {
      const results = await getAddressCoordinatesAutocomplete(query);
      setSuggestions(results ?? []);
      if (!results || results.length === 0) {
        clearMarkers();
      }
    }, 300)
  ).current;

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [coords[1], coords[0]],
      zoom: 12,
      speed: 1.5,
    });
  }, [coords]);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new Map({
      container: mapContainer.current,
      center: [coords[1], coords[0]],
      zoom: 13,
      apiKey: MAPTILER_KEY,
      projection: "globe",
    });
    mapRef.current = map;
    map.on("click", (event) => {
      const coords = event.lngLat; // Contiene { lng, lat }
      console.log("Coordenadas clic:", coords);
      orchestrateMarks({ lng: coords.lng, lat: coords.lat });
    });
    return () => {
      map.remove();
      window.speechSynthesis.cancel();
    };
  }, []);

  const orchestrateMarks = (coordinates: { lng: number; lat: number }) => {
    const coords = [coordinates.lng, coordinates.lat] as [number, number];
    if (!markerARef.current) {
      addMarkerA(coords);
      return;
    }
    if (!markerBRef.current) {
      addMarkerB(coords);
    }
  };

  const addMarkerA = (coordinates: [number, number]) => {
    if (!mapRef.current) return;
    const newMarkerA = new Marker({ color: "red" })
      .setLngLat(coordinates)
      .setPopup(new Popup({ offset: 25 }).setText("Origen de la entrega"))
      .addTo(mapRef.current);
    markerARef.current = newMarkerA;
  };

  const addMarkerB = (coordinates: [number, number]) => {
    if (!mapRef.current) return;
    const newMarkerB = new Marker({ color: "blue" })
      .setLngLat(coordinates)
      .setPopup(new Popup({ offset: 25 }).setText("Destino de la entrega"))
      .addTo(mapRef.current);
    markerBRef.current = newMarkerB;
    setMarkersReady(true);
  };

  const calculateRoute = async () => {
    if (!mapRef.current) return;
    const dataGeo = await getRouteGeoJSON(
      `${markerARef.current?.getLngLat().lng},${
        markerARef.current?.getLngLat().lat
      }`,
      `${markerBRef.current?.getLngLat().lng},${
        markerBRef.current?.getLngLat().lat
      }`
    );
    const routeGeoJSON = dataGeo.features[0].geometry;
    mapRef.current.addSource("route", { type: "geojson", data: routeGeoJSON });
    mapRef.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#007bff", "line-width": 4 },
    });

    mapRef.current.flyTo({
      center: [
        markerARef.current!.getLngLat().lng,
        markerARef.current!.getLngLat().lat,
      ],
      zoom: 18,
      speed: 1.5,
      bearing: getBearing(
        markerARef.current!.getLngLat(),
        markerBRef.current!.getLngLat()
      ),
      pitch: 60,
    });
    dataRouteGeoJsonRef.current = dataGeo;
    setCalculateRouteReady(true);
  };

  const getBearing = (
    start: { lng: number; lat: number },
    end: { lng: number; lat: number }
  ) => {
    const startLat = (start.lat * Math.PI) / 180;
    const startLng = (start.lng * Math.PI) / 180;
    const endLat = (end.lat * Math.PI) / 180;
    const endLng = (end.lng * Math.PI) / 180;

    const dLng = endLng - startLng;
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    const bearing = Math.atan2(y, x);
    return ((bearing * 180) / Math.PI + 360) % 360;
  };

  const clearMarkers = () => {
    if (!mapRef.current) return;
    if (markerARef.current) {
      markerARef.current.remove();
      markerARef.current = null;
    }
    if (markerBRef.current) {
      markerBRef.current.remove();
      markerBRef.current = null;
    }
    if (mapRef.current.getLayer("route")) {
      mapRef.current.removeLayer("route");
    }

    if (mapRef.current.getSource("route")) {
      mapRef.current.removeSource("route");
    }
    setMarkersReady(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (markerARef.current && markerBRef.current) return;
    if (!markerARef.current) {
      setQueryA(e.target.value);
    } else if (!markerBRef.current) {
      setQueryB(e.target.value);
    }
    debouncedFetch(e.target.value);
  };

  const clearInputsAddress = (coords: any) => {
    setSuggestions([]);
    if (!markerARef.current) {
      setQueryA(coords.name);
      addMarkerA(coords.coordinates);
    } else if (!markerBRef.current) {
      setQueryB(coords.name);
      addMarkerB(coords.coordinates);
    }
  };

  const loadRouteFromGeoJson = () => {
    if (!mapRef.current || !dataRouteGeoJsonRef.current) return;
    setCalculateRouteReady(false);
    setInitLoadingRoute(true);
    const routeGeoJSON = dataRouteGeoJsonRef.current.features[0].geometry;
    const stepsRef =
      dataRouteGeoJsonRef.current.features[0].properties.segments[0].steps;

    const vehicleMarker = new Marker({ color: "green" })
      .setLngLat([
        routeGeoJSON.coordinates[0][0],
        routeGeoJSON.coordinates[0][1],
      ])
      .addTo(mapRef.current);
    let i = 0;
    function moveMarker() {
      if (i < routeGeoJSON.coordinates.length) {
        vehicleMarker.setLngLat(routeGeoJSON.coordinates[i]);
        mapRef.current?.flyTo({
          center: routeGeoJSON.coordinates[i],
          zoom: 18,
          speed: 1.5,
        });
        const nextStep = stepsRef.find(
          (step: any) => i >= step.way_points[0] && i <= step.way_points[1]
        );
        if (nextStep) {
          const message = `Paso ${i + 1}: ${
            nextStep.instruction
          }, a ${nextStep.distance.toFixed(0)} metros`;
          setTextRouteStep(message);
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = "es-ES";
          utterance.rate = 1;
          utterance.pitch = 1;
          window.speechSynthesis.speak(utterance);
        }
        i++;
        setTimeout(moveMarker, 300);
      } else {
        setInitLoadingRoute(false);
        setTextRouteStep("Ruta completada.");
        vehicleMarker.remove();
      }
    }

    moveMarker();
  };

  return (
    <>
      <div
        className="p-3 z-10 relative flex justify-between
       items-center gap-2 bg-white rounded shadow-md w-[calc(100%-2rem)] mx-auto mb-4"
      >
        <label className="font-bold">Origen</label>
        <input
          type="text"
          value={queryA}
          onChange={handleChange}
          placeholder="Escribe una dirección..."
          className="border p-2 w-full rounded"
        />
        <label className="font-bold">Destino</label>
        <input
          type="text"
          value={queryB}
          onChange={handleChange}
          placeholder="Escribe una dirección..."
          className="border p-2 w-full rounded"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white border mt-1 max-h-60 overflow-auto z-10">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  clearInputsAddress(s);
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="relative w-full h-[calc(100vh-250px)] rounded-lg overflow-hidden shadow-lg">
        <SpaceBackground />

        <div ref={mapContainer} className="w-full h-full" />
        {markersReady && (
          <div className="absolute bg-white/50 top-4 left-0 right-0 p-3 z-10 flex justify-center">
            {!calculateRouteReady &&
              (!initLoadingRoute && (
                <>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={calculateRoute}
                  >
                    Calcular Ruta
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    onClick={() => {
                      clearMarkers();
                      setQueryA("");
                      setQueryB("");
                      mapRef.current?.flyTo({
                        center: [coords[1], coords[0]],
                        zoom: 12,
                        speed: 1.5,
                        pitch: 0,
                        bearing: 0,
                      });
                    }}
                  >
                    Limpiar Mapa
                  </button>
                </>
              ))}
            {calculateRouteReady && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                onClick={loadRouteFromGeoJson}
              >
                Iniciar Ruta
              </button>
            )}
          </div>
        )}
        {initLoadingRoute && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-xl font-bold bg-white/70 p-4 rounded">
              {textRouteStep}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MapDelivery;
