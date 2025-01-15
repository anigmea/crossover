import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (!jwtToken && !initialized) {
          // If no jwtToken and the user hasn't been initialized yet, run the initialization
          const response = await axios.get("http://68.183.92.7:8080/initialize");
          console.log("Initialize response:", response.data);

          const { token, user_id } = response.data;
          if (!user_id || !token) throw new Error("User ID or token is missing in the response");

          localStorage.setItem("token", token);
          setJwtToken(token);
          setUser({ id: user_id });
          setServerData(null);
          setInitialized(true); // Mark as initialized to avoid infinite loop
        } else if (jwtToken) {
          // If the token is present, verify the token and set user data
          const response = await axios.post(
            "http://68.183.92.7:8080/verify-token",
            {},
            {
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );
          console.log("Verify response:", response.data);

          const { NewuserId, data } = response.data;
          console.log(NewuserId);

          if (!NewuserId) throw new Error("User ID is missing in the verified response");

          setUser(NewuserId);
          setServerData(data); // Set the server data from the verification response
        }
      } catch (err) {
        console.error("Authentication error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Authentication failed");
        localStorage.removeItem("token");
        setJwtToken(null);
        setUser(null);
        setServerData(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [jwtToken, initialized]); // Add initialized to the dependency array

  return { jwtToken, user, serverData, loading, error };
};

export default useAuth;
