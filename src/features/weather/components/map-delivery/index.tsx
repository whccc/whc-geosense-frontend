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
      <div className="relative z-10 mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-red-500/4 to-pink-500/8 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-all duration-500 rounded-3xl"></div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-b-full opacity-60 group-hover:w-32 group-hover:opacity-100 transition-all duration-500"></div>
          
          <div className="flex items-center justify-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
              <span className="text-white text-xl">🗺️</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:via-red-500 group-hover:to-pink-600 transition-all duration-500">
              Mapa de Rutas
            </h1>
          </div>

          <p className="text-gray-700 text-xl text-center mb-10 max-w-3xl mx-auto font-medium leading-relaxed relative z-10">
            Calcula la mejor ruta entre dos ubicaciones con navegación paso a paso inteligente
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 max-w-5xl mx-auto relative z-10">
            <div className="flex-1 group/input">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse"></div>
                <label className="font-bold text-gray-800 text-base">
                  Punto de Origen
                </label>
              </div>
              <div className="relative group/field">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/10 to-red-500/20 rounded-2xl blur opacity-0 group-focus-within/field:opacity-100 transition-all duration-500"></div>
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl group-focus-within/field:shadow-2xl group-focus-within/field:border-red-300/60 transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <svg
                      className="w-6 h-6 text-red-400 group-focus-within/field:text-red-600 transition-colors duration-300"
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
                    className="w-full pl-14 pr-6 py-4 text-lg border-0 rounded-2xl focus:ring-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center px-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="w-12 h-1 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-blue-500 rounded-full"></div>
                <div
                  className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-lg"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-full p-2">
                <svg
                  className="w-6 h-6 text-gray-600"
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
            </div>

            <div className="flex-1 group/input">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg animate-pulse"></div>
                <label className="font-bold text-gray-800 text-base">
                  Punto de Destino
                </label>
              </div>
              <div className="relative group/field">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within/field:opacity-100 transition-all duration-500"></div>
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl group-focus-within/field:shadow-2xl group-focus-within/field:border-blue-300/60 transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <svg
                      className="w-6 h-6 text-blue-400 group-focus-within/field:text-blue-600 transition-colors duration-300"
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
                    className="w-full pl-14 pr-6 py-4 text-lg border-0 rounded-2xl focus:ring-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 relative z-10">
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <span className="text-orange-500 text-base">💡</span>
              <span className="font-medium">Haz clic en el mapa para marcar puntos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <span className="text-red-500 text-base">📍</span>
              <span className="font-medium">Origen en rojo</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <span className="text-blue-500 text-base">📍</span>
              <span className="font-medium">Destino en azul</span>
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-6">
              <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-6 py-4 border-b border-white/30">
                  <h3 className="font-bold text-gray-800 flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
      <div className="relative w-full h-[calc(100vh)] rounded-2xl overflow-hidden shadow-2xl border border-white/30">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 via-blue-900/5 to-purple-900/10 backdrop-blur-sm z-0"></div>
        
        <div ref={mapContainer} className="w-full h-full relative">
          <SpaceBackground />
          {markersReady && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 animate-slideInUp">
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/5 to-emerald-500/8 rounded-3xl group-hover:from-blue-500/12 group-hover:via-purple-500/8 group-hover:to-emerald-500/12 transition-all duration-500"></div>

                {!calculateRouteReady && !initLoadingRoute && (
                  <div className="relative flex flex-col sm:flex-row gap-4">
                    <button
                      className="group/btn relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                      onClick={calculateRoute}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                      <div className="relative w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300">
                        <svg
                          className="w-6 h-6"
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
                      className="group/btn relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/30"
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
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                      <div className="relative w-6 h-6 group-hover/btn:animate-bounce">
                        <svg
                          className="w-6 h-6"
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
                      className="group/mega relative overflow-hidden flex items-center gap-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-10 py-5 rounded-2xl font-black shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 animate-pulse hover:animate-none border-2 border-emerald-300/50"
                      onClick={loadRouteFromGeoJson}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/mega:translate-x-full transition-transform duration-1000"></div>
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-emerald-300/30 to-transparent translate-x-full group-hover/mega:-translate-x-full transition-transform duration-1000 delay-200"></div>

                      <div className="relative w-7 h-7 group-hover/mega:rotate-12 transition-all duration-300">
                        <svg
                          className="w-7 h-7 group-hover/mega:scale-110 transition-transform duration-300"
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

                      <span className="relative text-xl font-black bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent group-hover/mega:from-yellow-100 group-hover/mega:via-white group-hover/mega:to-yellow-100 transition-all duration-300">
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
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
              <div className="bg-white/98 backdrop-blur-xl p-8 rounded-3xl shadow-3xl border border-white/50 max-w-lg mx-6 transform animate-slideInUp relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-green-500/5 to-emerald-500/8 rounded-3xl"></div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse shadow-xl">
                      <svg
                        className="w-6 h-6 text-white animate-bounce"
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
                    <div className="absolute inset-0 border-3 border-blue-400/50 rounded-2xl animate-ping opacity-40"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                      🚗 Navegando Ruta
                    </h3>
                    <p className="text-lg text-gray-600 font-medium">
                      Siguiendo las instrucciones de navegación...
                    </p>
                  </div>
                </div>

                <div className="mb-6 relative z-10">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer shadow-lg"></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50/80 to-emerald-50/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/60 shadow-lg relative z-10">
                  <p className="text-gray-800 font-bold text-lg leading-relaxed text-center">
                    {textRouteStep}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 text-base text-gray-700 relative z-10">
                  <div className="bg-white/60 backdrop-blur-sm rounded-full p-2">
                    <svg
                      className="w-5 h-5 animate-pulse text-emerald-600"
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
                  </div>
                  <span className="font-medium">Audio activo</span>
                  <div className="flex gap-1.5">
                    <div
                      className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce shadow-sm"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce shadow-sm"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce shadow-sm"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showMessageSuccessRoute && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-slideInUp">
              <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-8 py-6 rounded-3xl shadow-3xl border-2 border-emerald-300/50 backdrop-blur-xl animate-bounce relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-400/10 to-emerald-400/20 rounded-3xl"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-spin-slow shadow-xl">
                      <svg
                        className="w-7 h-7 text-white"
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
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                    <div
                      className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div className="absolute inset-0 border-2 border-white/30 rounded-2xl animate-pulse"></div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-black text-2xl">¡Ruta Completada!</h3>
                      <span className="text-2xl animate-bounce">🎉</span>
                      <span className="text-xl animate-pulse" style={{ animationDelay: "0.3s" }}>✨</span>
                    </div>
                    <p className="text-emerald-100 text-lg font-semibold">
                      Has llegado exitosamente a tu destino
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 ml-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse shadow-lg"></div>
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-lg"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden relative z-10">
                  <div className="h-full bg-gradient-to-r from-white via-yellow-200 to-white rounded-full animate-shimmer bg-[length:200%_100%] shadow-inner"></div>
                </div>
                
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MapDelivery;
