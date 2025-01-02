import React from "react";
import styles from "./SelectBox.module.scss";
import {
  setSelectedRegion,
  setSelectedCity,
} from "../../../context/store/storeActions";
import { useStore } from "../../../context/store/storeContext";

const SelectBox: React.FC = () => {
  const { state, dispatch } = useStore();

  return (
    <div className={styles.selectBox}>
      <select
        className={styles.select}
        value={state.selectedRegion}
        onChange={(e) => dispatch(setSelectedRegion(e.target.value))}
      >
        <option value="">도/시를 선택하세요</option>
        {Object.keys(state.uniqueRegion).map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        value={state.selectedCity}
        onChange={(e) => dispatch(setSelectedCity(e.target.value))}
        disabled={!state.filteredCities.length}
      >
        <option value="">시(구/군)을 선택하세요</option>
        {state.filteredCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
