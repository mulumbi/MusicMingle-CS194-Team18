export type User = {
	name: string;
	email: string;
	bio: string;
	profile_image: UserContent;
	portfolio_videos: [UserContent];
	portfolio_images: [UserContent];
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

