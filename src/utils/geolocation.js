export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    const options = {
      enableHighAccuracy: false, // Faster, less battery drain
      timeout: 10000, // 10 second timeout
      maximumAge: 300000, // Accept cached position up to 5 minutes old
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Using default location.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "Unable to get location";
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};
