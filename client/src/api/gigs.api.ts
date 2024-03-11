import axios from "axios";
import { Gig, GigSearchParams } from "./types";

export const fetchGigs = async (
	searchParams: GigSearchParams
): Promise<Gig[]> => {
	const query = new URLSearchParams();
	if (searchParams.name) query.append("name", searchParams.name);
	if (searchParams.gig_role_tags)
		query.append(
			"gig_role_tags",
			JSON.stringify(searchParams.gig_role_tags)
		);
	if (searchParams.gig_genre_tags)
		query.append(
			"gig_genre_tags",
			JSON.stringify(searchParams.gig_genre_tags)
		);
	if (searchParams.event_start)
		query.append("event_start", searchParams.event_start);
	if (searchParams.event_end)
		query.append("event_end", searchParams.event_end);
	query.append("flat_rate_start", searchParams?.min_budget?.toString());
	query.append("flat_rate_end", searchParams?.max_budget?.toString());

	const response = await axios.get(
		`${import.meta.env.VITE_BACKEND_URL}/search_gigs?${query.toString()}`
	);
	return response.data;
};

export const fetchGig = async (
	gig_id: string,
	currentUser: any
): Promise<Gig> => {
	const query = new URLSearchParams();
	query.append("gig_id", gig_id);
	const token = await currentUser.getIdToken();
	const response = await axios
		.get(
			`${
				import.meta.env.VITE_BACKEND_URL
			}/search_gigs?${query.toString()}`,
			{
				headers: {
					authorization: token,
					"Content-Type": "application/json",
				},
			}
		)
		.then((res) => {
			const gig: Gig = res.data;
			console.log("gig", gig);
			return gig;
		})
		.catch((err) => {
			console.error("Error fetching gig: ", err);
			throw err;
		});
	return response;
};

export const mutateApplication = async (currentUser: any, id: string) => {
	const token = await currentUser.getIdToken();
	const query = new URLSearchParams();
	query.append("gig_id", id);
	console.log("query", query.toString());
	const data = await axios
		.post(
			`${
				import.meta.env.VITE_BACKEND_URL
			}/gigs/application?${query.toString()}`,
			{
				headers: {
					authorization: token,
					"Content-Type": "application/json",
				},
			}
		)
		.then((res) => {
			const application = res.data;
			console.log(application, "application");
			return application;
		})
		.catch((err) => console.log("create application mutate error: ", err));
	return data;
};

export const fetchGigByName = async (name: string): Promise<Gig> => {
	const response = await axios.get(
		`${import.meta.env.VITE_BACKEND_URL}/search_gigs?name=${name}`
	);
	if (response.data && response.data.length > 0) {
		return response.data[0];
	}
	throw new Error("Gig not found");
};

export const ApplyToGig = async (gig_id: string, applicationDetails: any, currentUser: any): Promise<any> => {
    const token = await currentUser.getIdToken(); 
    const endpoint = `${import.meta.env.VITE_BACKEND_URL}/gigs/application/?gig_id=${gig_id}`; 

    try {
        const response = await axios.post(endpoint, applicationDetails, {
            headers: {
                'authorization': token, 
                'Content-Type': 'application/json', 
            },
        });
        console.log("Application submitted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error applying to gig:", error);
        throw error;
    }
};