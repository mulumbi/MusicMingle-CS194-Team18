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
	pubilc_url: string;
};
