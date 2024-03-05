import axios from "axios";
import { User, UserContent } from "./types";

// Fetch the profile details of the current user
export const fetchProfileDetails = async (currentUser: any): Promise<User | null> => {
  try {
    const token = await currentUser.getIdToken();
    console.log("User token", token);
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (err) {
    console.error("profile data fetch error: ", err);
    return null; 
  }
};

// Fetch the gigs data for the current user
export const fetchGigsData = async (currentUser: any): Promise<UserContent | null> => {
  try {
    const token = await currentUser.getIdToken();
    console.log("User token", token);
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/mygigs`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (err) {
    console.error("my Gigs data fetch error: ", err);
    return null; 
  }
};
