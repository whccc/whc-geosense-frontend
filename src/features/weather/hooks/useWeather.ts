import api from "../../shared/api/axios";
import type { IApiResponse } from "../../shared/interface/IApiResponse";
import type { IWeather } from "../interfaces/weather";

const useWeather = () => {
  const getWeather = async (latitude: number, longitude: number) => {
    const data = await api.get<IApiResponse<IWeather>>(
      `/weather?latitude=${latitude}&longitude=${longitude}`
    );
    return data.data;
  };

  const getCityCoordinates = async (city: string) => {
    try {
      const response = await api.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          city
        )}.json?key=${import.meta.env.VITE_MAPTILER_KEY}&limit=1`
      );
      const data = response.data;
      if (data.features && data.features.length > 0) {
        const [lon, lat] = data.features[0].geometry.coordinates;
        return [lat, lon];
      }
      return null;
    } catch (error) {
      console.error("Error buscando ciudad:", error);
      return null;
    }
  };

  const getAddressCoordinatesAutocomplete = async (address: string) => {
    try {
      const response = await api.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          address
        )}.json?key=${
          import.meta.env.VITE_MAPTILER_KEY
        }&country=co&autocomplete=true&limit=10&proximity=ip`
      );
      const data = response.data;
      const suggestions = data.features.map((f: any) => ({
        name: f.place_name,
        coordinates: f.geometry.coordinates,
      }));
      return suggestions;
    } catch (error) {
      console.error("Error buscando ciudad:", error);
      return null;
    }
  };

  const getRouteGeoJSON = async (start: string, end: string) => {
    const response = await api.get(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${
        import.meta.env.VITE_KEY_ROUTER
      }&start=${start}&end=${end}&lang=es`
    );
    const data = response.data;
    const routeGeoJSON = data;
    return routeGeoJSON;
  };
  return {
    getWeather,
    getCityCoordinates,
    getRouteGeoJSON,
    getAddressCoordinatesAutocomplete,
  };
};
export default useWeather;
