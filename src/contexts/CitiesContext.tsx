import { createContext, useContext, useEffect, useState } from "react";
import { City as CityModel } from "../models/City";

const DATA_URL = "http://localhost:8000";
const CitiesContext = createContext({});

function CitiesProvider({ children }) {
  const [cities, setCities] = useState<CityModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      setIsLoading(true);
      try {
        const res = await fetch(`${DATA_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("There was a problem loading the data...");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  return (
    <CitiesContext.Provider value={{ cities, isLoading }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside provider");
  return context;
}

export { CitiesProvider, useCities };
