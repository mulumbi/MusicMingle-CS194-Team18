import axios from "axios";
import { Artist, ArtistSearchParams } from "./types";

export const fetchArtists = async (
	searchParams: ArtistSearchParams
): Promise<Artist[]> => {
	console.log(searchParams, "searchParams");
	const query = new URLSearchParams();
	if (searchParams.name) query.append("name", searchParams.name);
	if (searchParams.user_genre_tags)
		query.append(
			"user_genre_tags",
			JSON.stringify(searchParams.user_genre_tags)
		);
	if (searchParams.user_role_tags)
		query.append(
			"user_role_tags",
			JSON.stringify(searchParams.user_role_tags)
		);
	if (searchParams.flat_rate_start)
		query.append(
			"flat_rate_start",
			searchParams?.flat_rate_start?.toString()
		);
	if (searchParams.flat_rate_end)
		query.append("flat_rate_end", searchParams?.flat_rate_end?.toString());

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
