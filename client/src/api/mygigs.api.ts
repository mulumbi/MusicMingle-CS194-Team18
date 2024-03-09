import axios from "axios";
import { User, UserContent } from "./types";

// Fetch the gigs data for the current user
export const fetchGigsData = async (currentUser: any): Promise<any> => {
	console.log(currentUser, await currentUser.getIdToken(), "currentUser");
	const token = await currentUser.getIdToken();
	console.log("User token", token);
	const response = await axios
		.get(`${import.meta.env.VITE_BACKEND_URL}/mygigs`, {
			headers: { authorization: token },
		})
		.then((res) => {
			console.log(res, "res");
			return res.data;
		})
		.catch((err) => {
			console.error("my Gigs data fetch error: ", err);
			return null;
		});
	return response;
};
