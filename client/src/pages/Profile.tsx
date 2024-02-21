import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchProfileDetails, mutateProfileDetails } from "../api/profile.api";
import { Button } from "@/components/ui/button"
import PortfolioItem from "@/components/PortfolioItem.tsx"; // Assuming your environment resolves .tsx

import defaultBanner from "../assets/Background.png";
import defaultProfile from "../assets/profile/DefaultProfile.png";


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

	// Fetch user data
	const { data, error, isLoading } = useQuery({
		queryKey: ["profile_get"],
		queryFn: () => fetchProfileDetails(currentUser),
	});

	const mutation = useMutation({
		mutationFn: (bodyFormData: any) =>
			mutateProfileDetails(currentUser, bodyFormData),
	});

	// Submit form with new profile information
	const onSubmit = ({
		profile_image,
		portfolio_images,
		videos,
		bio,
		deleted_portfolio_images,
		deleted_videos,
	}) => {
		const bodyFormData = new FormData();
		if (profile_image) 
			bodyFormData.append("profile_image", profile_image);
		if (portfolio_images)
			bodyFormData.append("portfolio_images", portfolio_images);
		if (videos) 
			bodyFormData.append("videos", videos);
		if (bio) 
			bodyFormData.append("bio", bio);
		if (deleted_portfolio_images)
			bodyFormData.append("deleted_portfolio_images", deleted_portfolio_images);
		if (deleted_videos)
			bodyFormData.append("deleted_videos", deleted_videos);
		mutation.mutate(bodyFormData);
	};

	// TODO: Conditional display below for skeleton components when loading
	console.log("loading", isLoading);
	console.log("data", data);
	console.log("error", error);

	// Add form component: https://ui.shadcn.com/docs/components/form
	return (
		<div className="profile-page">
			<img className="profile-banner" src={defaultBanner} alt="Profile Photo" />
			<div className="profile-main">

				<div className="profile-row">
					<div className="profile-left">
						<img className="profile-photo" src={defaultProfile} alt="Profile Photo" />
					</div>
					<div className="profile-right">
						<div>
							{/* TODO: Extract account name from Google sign in */}
							<h2>{currentUser?.email?.split("@")[0]}</h2>
							<p>{currentUser?.email}</p>
						</div>
						<div>
							<Button className="profile-button" onClick={console.log("Edit")}>Edit Profile</Button>
							<Button className="profile-button" onClick={signOut}>Sign Out</Button>
						</div>
					</div>
				</div>
				
				<div className="profile-row">
					<div className="profile-left">
						<h3>About Me</h3>
					</div>
					<div className="profile-right bio">
						<p>
							Tell us about yourself!
						</p>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Roles</h3>
					</div>
					<div className="profile-right">
						<Button className="profile-role" disabled={true}>Musician</Button> 
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Portfolio</h3>
					</div>
					<div className="profile-right">
						<div className="portfolio">
							<div className="portfolio-item"> 
								<PortfolioItem />
							</div>
							<div className="portfolio-item"> 
								<PortfolioItem />
							</div>
							<div className="portfolio-item"> 
								<PortfolioItem />
							</div>
       					</div>
					</div>
				</div>

			</div>
		</div>
	);
}
export default Profile;
