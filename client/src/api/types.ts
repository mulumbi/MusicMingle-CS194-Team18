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
	pubilc_url: string;
};
