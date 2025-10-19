import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Map, Marker, Popup } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import debounce from "lodash.debounce";
import SpaceBackground from "../space";
import useWeather from "../../hooks/useWeather";

interface WeatherMapProps {
  coords: Array<number>;
  resetMap: boolean;
}
const MapDelivery = ({ coords, resetMap }: WeatherMapProps) => {
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
    if (resetMap) {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [-60, -10],
        zoom: 3,
        speed: 1.5,
      });
    }
  }, [resetMap]);

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
    }); /*
    map.on("load", () => {
  
      const depot = [-75.5743, 6.2442];
      const stops = [
        [-75.565, 6.25], // Cliente 1
        [-75.558, 6.248], // Cliente 2
      ];
      // Marcador del depósito
      /*  new Marker({ color: "green" })
        .setLngLat(depot)
        .setPopup("Depósito")
        .addTo(map);

      // Marcadores de clientes
      stops.forEach((coord, idx) => {
        new Marker({ color: "blue" })
          .setLngLat(coord)
          .setPopup(`Cliente ${idx + 1}`)
          .addTo(map);
      });
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNmZTA4NGY0YjRhZjQ0NGJhMTA3ZmQ5ZWY0NmM1OWRlIiwiaCI6Im11cm11cjY0In0=&start=-75.5743,6.2442&end=-75.558,6.248&language=es`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const routeGeoJSON = data.features[0].geometry;

          // 1️⃣ Dibujar ruta en el mapa
          map.addSource("route", { type: "geojson", data: routeGeoJSON });
          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#007bff", "line-width": 4 },
          });

          // 2️⃣ Obtener instrucciones paso a paso
          const steps = data.features[0].properties.segments[0].steps;

          // 3️⃣ Animar vehículo (opcional)
          const vehicleMarker = new Marker({ color: "red" })
            .setLngLat([
              data.features[0].geometry.coordinates[0][0],
              data.features[0].geometry.coordinates[0][1],
            ])
            .addTo(map);

          let i = 0;
          function moveMarker() {
            if (i < routeGeoJSON.coordinates.length) {
              vehicleMarker.setLngLat(routeGeoJSON.coordinates[i]);
              // 4️⃣ Detectar si estamos cerca de un giro
              const nextStep = steps.find(
                (step) => i >= step.way_points[0] && i <= step.way_points[1]
              );
              if (nextStep) {
                console.log(`Instrucción actual: ${nextStep.instruction}`);
                const message = `Paso ${i + 1}: ${
                  nextStep.instruction
                }, a ${nextStep.distance.toFixed(0)} metros`;

                console.log(message);

                // Crear objeto de síntesis de voz
                const utterance = new SpeechSynthesisUtterance(message);

                // Opcional: configurar idioma y velocidad
                utterance.lang = "es-ES"; // Español
                utterance.rate = 1; // Velocidad normal (0.5 a 2)
                utterance.pitch = 1; // Tono normal (0 a 2)

                // Reproducir voz
                window.speechSynthesis.speak(utterance);
              }
              i++;
              setTimeout(moveMarker, 500);
            }
          }

          moveMarker();
  })
    });*/
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
    const routeGeoJSON = dataGeo;
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
      zoom: 15,
      speed: 1.5,
    });
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
      <div className="relative w-full h-[calc(100vh-150px)] rounded-lg overflow-hidden shadow-lg">
        <SpaceBackground />

        <div ref={mapContainer} className="w-full h-full" />
        {markersReady && (
          <div className="absolute bg-white/50 top-4 left-0 right-0 p-3 z-10 flex justify-center">
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
              }}
            >
              Limpiar Mapa
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MapDelivery;
