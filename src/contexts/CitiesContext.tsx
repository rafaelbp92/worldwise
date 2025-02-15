import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { City } from "../models/City";

const DATA_URL = "http://localhost:8000";
const CitiesContext = createContext({});

type CitiesContextType = {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
  getCity: (id: string) => Promise<void>;
  createCity: (newCity: City) => Promise<void>;
  deleteCity: (id: number) => Promise<void>;
};

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: null,
  error: "",
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "cities/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case "cities/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "error":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Action type not supported");
  }
}

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState<City[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState<City | null>(null);

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${DATA_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "error",
          payload: "There was a problem loading the cities...",
        });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id: string) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${DATA_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "error",
        payload: "There was a problem loading the city...",
      });
    }
  }

  async function createCity(newCity: City) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${DATA_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "cities/created", payload: data });
    } catch {
      dispatch({
        type: "error",
        payload: "There was a problem creating the city...",
      });
    }
  }

  async function deleteCity(id: number) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${DATA_URL}/cities/${id}`, { method: "DELETE" });
      dispatch({ type: "cities/deleted", payload: id });
    } catch {
      dispatch({
        type: "error",
        payload: "There was a problem deleting the city...",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
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
