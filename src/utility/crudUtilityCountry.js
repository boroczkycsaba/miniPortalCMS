import axios from "axios";

const countriesURL = `${import.meta.env.VITE_ALL_COUNTRIES_URL}`

export const getAllCountries = async (setAllCountries) => {
    console.debug("Countries api:",countriesURL);
    const countriesURLLang=countriesURL + "?fields=name"
    console.debug("Countries api:",countriesURLLang);
    const countriesDataResponse = await axios.get(countriesURLLang, {});
    console.debug("Response:",countriesDataResponse);
    return countriesDataResponse.data;
}