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

// For closing a gig
export const mutateCloseGig = async (
	currentUser: any,
	gig_id: any
) => {
	const token = await currentUser.getIdToken();
	const query = new URLSearchParams();
	query.append("gig_id", gig_id)
	
	const response = await axios
		.post(`${import.meta.env.VITE_BACKEND_URL}/mygigs/close_gig?` + query.to_string(), {
			headers: { authorization: token },
		})
		.then((res) => {
			const gig: Gig = res.data;
			console.log(gig, "Successfully closed gig!");
			return gig;
		})
		.catch((err) => console.error("my Gigs close gig mutate error: ", err));
	return response;
};

// For withdrawing an application
export const mutateWithdrawApp = async (
	currentUser: any,
	gig_id: any
) => {
	const token = await currentUser.getIdToken();
	const query = new URLSearchParams();
	query.append("gig_id", gig_id)
	
	const response = await axios
		.post(`${import.meta.env.VITE_BACKEND_URL}/mygigs/withdraw_app?` + query.to_string(), {
			headers: { authorization: token },
		})
		.then((res) => {
			console.log(res, "res");
			return res.data;
		})
		.catch((err) => console.error("my Gigs withdraw app mutate error: ", err));
	return response;
};
