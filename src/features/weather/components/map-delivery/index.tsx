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
  const [showMessageSuccessRoute, setShowMessageSuccessRoute] = useState(false);
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
      fullscreenControl: true,
    });
    mapRef.current = map;
    map.on("click", (event) => {
      const coords = event.lngLat;
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
    setShowMessageSuccessRoute(false);
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
        setShowMessageSuccessRoute(true);
        setInitLoadingRoute(false);
        setTextRouteStep("Ruta completada.");
        vehicleMarker.remove();
      }
    }

    moveMarker();
  };

  return (
    <>
      <div className="relative z-10  mx-auto mb-6">
        <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-2xl shadow-xl border border-gray-200/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🌍</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Mapa de Rutas
            </h1>
          </div>

          <p className="text-gray-600 text-center mb-6 max-w-xl mx-auto">
            Calcula la mejor ruta entre dos ubicaciones con navegación paso a
            paso
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <label className="font-semibold text-gray-800 text-sm">
                  Punto de Origen
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={queryA}
                  onChange={handleChange}
                  placeholder="Ingresa tu ubicación de salida..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center px-3 pb-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full animate-pulse"></div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
                <div
                  className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <svg
                className="w-6 h-6 text-gray-400 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                <label className="font-semibold text-gray-800 text-sm">
                  Punto de Destino
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={queryB}
                  onChange={handleChange}
                  placeholder="Ingresa tu destino final..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-orange-500">💡</span>
              <span>Haz clic en el mapa para marcar puntos</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <span className="text-red-500">📍</span>
              <span>Origen en rojo</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <span className="text-blue-500">📍</span>
              <span>Destino en azul</span>
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-4">
              <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Ubicaciones encontradas
                  </h3>
                </div>
                <ul className="max-h-60 overflow-auto">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 group"
                      onClick={() => {
                        clearInputsAddress(s);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-200">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium truncate">
                            {s.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Coordenadas: {s.coordinates[1].toFixed(4)},{" "}
                            {s.coordinates[0].toFixed(4)}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full h-[calc(100vh-328px)] rounded-lg overflow-hidden shadow-lg">
        <div ref={mapContainer} className="w-full h-full">
          <SpaceBackground />
          {markersReady && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 animate-slideInUp">
              <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-2xl"></div>

                {!calculateRouteReady && !initLoadingRoute && (
                  <div className="relative flex flex-col sm:flex-row gap-3">
                    <button
                      className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-blue-500/90 via-blue-600/90 to-indigo-600/90 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 backdrop-blur-sm border border-blue-400/30"
                      onClick={calculateRoute}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                      <div className="relative w-5 h-5 group-hover:rotate-12 transition-transform duration-300">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                      </div>

                      <span className="relative font-bold">Calcular Ruta</span>

                      <svg
                        className="w-4 h-4 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    <button
                      className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-red-500/90 via-red-600/90 to-pink-600/90 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 backdrop-blur-sm border border-red-400/30"
                      onClick={() => {
                        clearMarkers();
                        setQueryA("");
                        setQueryB("");
                        mapRef.current?.flyTo({
                          center: [coords[1], coords[0]],
                          zoom: 13,
                          speed: 1.5,
                          pitch: 0,
                          bearing: 0,
                        });
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                      <div className="relative w-5 h-5 group-hover:animate-bounce">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>

                      <span className="relative font-bold">Limpiar Mapa</span>
                    </button>
                  </div>
                )}

                {calculateRouteReady && (
                  <div className="relative">
                    <button
                      className="group relative overflow-hidden flex items-center gap-4 bg-gradient-to-r from-emerald-500/95 via-green-500/95 to-teal-500/95 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 backdrop-blur-sm border border-emerald-400/40 animate-pulse hover:animate-none"
                      onClick={loadRouteFromGeoJson}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-emerald-300/20 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-1000 delay-200"></div>

                      <div className="relative w-6 h-6 group-hover:rotate-12 transition-all duration-300">
                        <svg
                          className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V6a1 1 0 011-1h4a1 1 0 011 1v4"
                          />
                        </svg>
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-80"></div>
                      </div>

                      <span className="relative text-lg font-black bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent group-hover:from-yellow-100 group-hover:via-white group-hover:to-yellow-100 transition-all duration-300">
                        🚀 INICIAR RUTA
                      </span>

                      <div className="relative">
                        <svg
                          className="w-5 h-5 opacity-80 group-hover:opacity-100 transform group-hover:translate-x-2 group-hover:scale-125 transition-all duration-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <div className="absolute inset-0 bg-white/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-50"></div>
                      </div>
                    </button>

                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}

                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-full opacity-60"></div>
              </div>

              <div className="absolute -top-4 -left-4 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce opacity-70"></div>
              <div className="absolute -top-2 -right-6 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute -bottom-3 left-2 w-1 h-1 bg-green-400/60 rounded-full animate-ping opacity-50"></div>
            </div>
          )}
          {initLoadingRoute && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fadeIn">
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 max-w-md mx-4 transform animate-slideInUp">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg
                        className="w-4 h-4 text-white animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>

                    <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      🚗 Navegando Ruta
                    </h3>
                    <p className="text-sm text-gray-600">
                      Siguiendo las instrucciones...
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-200/50">
                  <p className="text-gray-800 font-medium leading-relaxed text-center">
                    <strong>{textRouteStep}</strong>
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <span>Audio activo</span>
                  <div className="flex gap-1">
                    <div
                      className="w-1 h-3 bg-green-400 rounded animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-3 bg-green-400 rounded animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1 h-3 bg-green-400 rounded animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showMessageSuccessRoute && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-slideInUp">
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-400/30 backdrop-blur-sm animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-spin-slow">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                    <div
                      className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">¡Ruta Completada!</h3>
                      <span className="text-xl animate-bounce">🎉</span>
                    </div>
                    <p className="text-green-100 text-sm font-medium">
                      Has llegado exitosamente a tu destino
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 ml-2">
                    <div className="w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
                    <div
                      className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-white via-yellow-200 to-white rounded-full animate-shimmer bg-[length:200%_100%]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MapDelivery;
