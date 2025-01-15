// useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [serverData, setServerData] = useState(null); // State to store server response
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("token") || null); // Retrieve the token from localStorage if it exists
  const [isTokenLoaded, setIsTokenLoaded] = useState(false); // State to check if JWT token has been loaded

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Prevent infinite loop by checking if token is already set
        if (!jwtToken) return;

        // Include JWT token in the request headers if it's available
        const config = {
          headers: { Authorization: `Bearer ${jwtToken}` }
        };

        const response = await axios.get("http://localhost:8080/initialize", config);
        console.log("Server Response:", response);

        // Store the JWT token in localStorage if needed (e.g., during initialization or login)
        if (response.data.token && !jwtToken) {
          localStorage.setItem("token", response.data.token); // Save the token
          setJwtToken(response.data.token); // Set the token in state
        }

        setServerData(response.data);
        setIsTokenLoaded(true); // Mark token as loaded once data is fetched
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jwtToken]); // Re-run the effect if the JWT token changes

  return { serverData, loading, error, jwtToken, isTokenLoaded };
};

export default useAuth;
