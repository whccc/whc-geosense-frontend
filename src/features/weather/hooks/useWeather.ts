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
  return { getWeather, getCityCoordinates };
};
export default useWeather;
