import axios from "axios";

let cachedFestivos = null;

export async function obtenerFestivosColombia(year = new Date().getFullYear()) {
    const key = `festivos_colombia_${year}`;

    if (cachedFestivos) {
        return cachedFestivos;
    }

    const local = localStorage.getItem(key);
    if (local) {
        cachedFestivos = JSON.parse(local);
        return cachedFestivos;
    }

    try {
        const { data } = await axios.get(
            `https://api-colombia.com/api/v1/holiday/year/${year}`
        );
        cachedFestivos = data.map(f => f.date.substr(0, 10));

        localStorage.setItem(key, JSON.stringify(cachedFestivos));

        return cachedFestivos;
    } catch (error) {
        return [];
    }
}
