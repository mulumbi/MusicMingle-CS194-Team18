import axios from "axios";
import { Artist } from "./types";

export const fetchArtists = async (searchParams: {
	name?: string;
	user_role_tags?: string[];
	min_flat_rate?: number;
	max_flat_rate?: number;
}): Promise<Artist[]> => {
	console.log(searchParams, "searchParams");
	const query = new URLSearchParams();
	if (searchParams.name) query.append("name", searchParams.name);
	if (searchParams.user_role_tags)
		query.append(
			"user_role_tags",
			JSON.stringify(searchParams.user_role_tags)
		);

	if (searchParams.min_flat_rate !== undefined) {
		query.append("min_flat_rate", searchParams.min_flat_rate.toString());
	}
	if (searchParams.max_flat_rate !== undefined) {
		query.append("max_flat_rate", searchParams.max_flat_rate.toString());
	}
	console.log(query, query.toString(), "query");
	const data = await axios
		.get(
			import.meta.env.VITE_BACKEND_URL +
			"/artists" +
			"?" +
			query.toString()
		)
		.then((res) => {
			console.log(res);
			const artists: [Artist] = res.data;
			return artists;
		})
		.catch((err) => {
			console.error("Error fetching artists: ", err);
			throw err;
		});
	return data;
};


