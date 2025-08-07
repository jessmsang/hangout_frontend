export const fetchCoordinatesByCity = async (cityName, weatherAPIkey) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        cityName
      )}&limit=1&appid=${weatherAPIkey}`
    );

    const data = await response.json();

    if (!response.ok || data.length === 0) {
      throw new Error("City not found or invalid response.");
    }

    return {
      latitude: data[0].lat,
      longitude: data[0].lon,
    };
  } catch (error) {
    console.error("Error fetching coordinates by city:", error.message);
    throw error;
  }
};
