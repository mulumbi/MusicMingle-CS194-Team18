export type User = {
	name: string;
	email: string;
	bio: string;
	profile_image: UserContent;
	portfolio_videos: [UserContent];
	portfolio_images: [UserContent];
	user_role_tags: [string];
	user_genre_tags: [string];
	estimate_flat_rate: number;
	is_artist: boolean;
};

export type UserContent = {
	id: string;
	file_name: string;
	public_url: string;
};

export type Artist = {
	id: string;
	uuid: string;
	name: string;
	email: string;
	bio: string;
	user_genre_tags: string[];
	user_role_tags: string[];
	organization_name: string;
	organization_group_size: number;
	estimate_flat_rate: number;
	is_artist: boolean;
	createdAt: string;
	updatedAt: string;
	profile_image?: UserContent; // Optional if you want to include profile images for artists
	portfolio_videos?: UserContent[]; // Assuming these might exist based on the User type
	portfolio_images?: UserContent[]; // Assuming these might exist based on the User type
};

export type ArtistSearchParams = {
	name?: string;
	user_role_tags?: string[];
	user_genre_tags?: string[];
	flat_rate_start?: number; 
	flat_rate_end?: number; 
};


export type GigSearchParams = {
	name?: string;
	gig_role_tags?: string[];
	gig_genre_tags?: string[];
	event_start?: string;
	event_end?: string;
	min_budget?: number; // Added line
	max_budget?: number; // Added line
};

export type Gig = {
	id: string;
	estimate_flat_rate: number;
	name: string;
	bio: string;
	event_start: string;
	event_end: string;
	gig_role_tags: [string];
	gig_genre_tags: [string];
	createdAt: string;
	updatedAt: string;
	user: User;
	gigImages: [UserContent];
};
