import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { CitiesContextType, useCities } from "../contexts/CitiesContext";
import { useEffect } from "react";
import Spinner from "./Spinner";
import { City as CityModel } from "../models/City";
import BackButton from "./BackButton";
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams();
  const { getCity, currentCity, isLoading } = useCities() as CitiesContextType;

  useEffect(() => {
    getCity(id as string);
  }, [id]);

  if (isLoading || !currentCity) return <Spinner />;

  const { cityName, emoji, date, notes } = currentCity as CityModel;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{date ? formatDate(date) : ""}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div className={styles.buttons}>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
