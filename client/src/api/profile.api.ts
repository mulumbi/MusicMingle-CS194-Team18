import axios from "axios";
import { UserContent, User } from "./types";

export const fetchProfileDetails = async (currentUser: any) => {
	const token = await currentUser.getIdToken();
	console.log("User token", token);
	const data = await axios
		.get(import.meta.env.VITE_BACKEND_URL + "/profile", {
			headers: { authorization: token },
		})
		.then((res) => {
			const user: User = res.data;
			return user;
		})
		.catch((err) => console.log("profile data fetch error: ", err));
	return data;
};

export const mutateProfileDetails = async (
	currentUser: any,
	bodyFormData: FormData
) => {
	const token = await currentUser.getIdToken();
	const data = await axios
		.post(
			import.meta.env.VITE_BACKEND_URL + "/profile/edit",
			bodyFormData,
			{
				headers: {
					authorization: token,
					"Content-Type": "application/json",
				},
			}
		)
		.then((res) => {
			const user: User = res.data;
			return user;
		})
		.catch((err) => console.log("profile data mutate error: ", err));
	console.log(data);
	return data;
};
