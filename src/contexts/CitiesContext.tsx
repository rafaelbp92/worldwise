import { createContext, useContext, useEffect, useState } from "react";
import { City } from "../models/City";

const DATA_URL = "http://localhost:8000";
const CitiesContext = createContext({});

type CitiesContextType = {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
  getCity: (id: string) => Promise<void>;
  createCity: (newCity: City) => Promise<void>;
};

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | null>(null);

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

  async function getCity(id: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`${DATA_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("There was a problem loading the data...");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity: City) {
    setIsLoading(true);
    try {
      const res = await fetch(`${DATA_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch {
      alert("There was a problem creating the city...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity, createCity }}>
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
export type { CitiesContextType };
