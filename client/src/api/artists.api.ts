
import axios from "axios";
import { Artist } from "./types";

export const fetchArtists = async (searchParams: {
    name?: string;
    user_role_tags?: string[];
}): Promise<Artist[]> => {
    const query = new URLSearchParams();
    if (searchParams.name) query.append('name', searchParams.name);
    if (searchParams.user_role_tags) query.append('user_role_tags', JSON.stringify(searchParams.user_role_tags));

    const data = await axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/artists/?${query.toString()}`)
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching artists: ", err);
            throw err;
        });
    return data;
};
