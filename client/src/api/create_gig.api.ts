import axios from "axios";
import { Gig } from "./types";

export const mutateCreateGig = async (
	currentUser: any,
	bodyFormData: FormData
) => {
	const token = await currentUser.getIdToken();
	const data = await axios
		.post(import.meta.env.VITE_BACKEND_URL + "/gigs/create", bodyFormData, {
			headers: {
				authorization: token,
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => {
			const gig: Gig = res.data;
			console.log(gig, "New Gig!");
			return gig;
		})
		.catch((err) => console.log("create gig mutate error: ", err));
	return data;
};
