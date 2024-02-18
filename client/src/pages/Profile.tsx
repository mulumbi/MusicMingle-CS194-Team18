import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchProfileDetails, mutateProfileDetails } from "../api/profile.api";
import { Button } from "@/components/ui/button";

interface FormData {
	profile_image: string;
	portfolio_images: string[];
	videos: { url: string; title: string }[];
	bio: string;
}

function Profile() {
	const { currentUser, signOut } = useContext(AuthContext);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data, error, isLoading } = useQuery({
		queryKey: ["profile_get"],
		queryFn: () => fetchProfileDetails(currentUser),
	});

	const mutation = useMutation({
		mutationFn: (bodyFormData: any) =>
			mutateProfileDetails(currentUser, bodyFormData),
	});

	const onSubmit = ({
		profile_image,
		portfolio_images,
		videos,
		bio,
		deleted_portfolio_images,
		deleted_videos,
	}) => {
		const bodyFormData = new FormData();
		if (profile_image) bodyFormData.append("profile_image", profile_image);
		if (portfolio_images)
			bodyFormData.append("portfolio_images", portfolio_images);
		if (videos) bodyFormData.append("videos", videos);
		if (bio) bodyFormData.append("bio", bio);
		if (deleted_portfolio_images)
			bodyFormData.append(
				"deleted_portfolio_images",
				deleted_portfolio_images
			);
		if (deleted_videos)
			bodyFormData.append("deleted_videos", deleted_videos);
		mutation.mutate(bodyFormData);
	};

	if (isLoading) {
		// Create loading screen
		<h1>loading...</h1>;
	}
	console.log(isLoading, "loading");
	console.log(data, "data");
	console.log(error, "error");

	// Add form component: https://ui.shadcn.com/docs/components/form
	return (
		<div>
			<h3>Welcome! {currentUser?.email}</h3>
			<p>Sign In Status: {currentUser && "active"}</p>
			<Button onClick={onSubmit}>Submit</Button>
			<Button onClick={signOut}>Sign Out</Button>
		</div>
	);
}
export default Profile;
