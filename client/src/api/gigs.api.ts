import axios from "axios";
import { Gig, GigSearchParams } from "./types";

export const fetchGigs = async (searchParams: GigSearchParams): Promise<Gig[]> => {
    const query = new URLSearchParams();
    if (searchParams.name) query.append("name", searchParams.name);
    if (searchParams.gig_role_tags) query.append("gig_role_tags", JSON.stringify(searchParams.gig_role_tags));
    if (searchParams.gig_genre_tags) query.append("gig_genre_tags", JSON.stringify(searchParams.gig_genre_tags));
    if (searchParams.event_start) query.append("event_start", searchParams.event_start);
    if (searchParams.event_end) query.append("event_end", searchParams.event_end);
    if (searchParams.min_budget) query.append("min_budget", searchParams.min_budget.toString());
    if (searchParams.max_budget) query.append("max_budget", searchParams.max_budget.toString());

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/gigs?${query.toString()}`);
    return response.data;
};




