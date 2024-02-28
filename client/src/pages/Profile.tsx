import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchProfileDetails, mutateProfileDetails } from "../api/profile.api";
import { Button } from "@/components/ui/button"
import EditProfile from "@/components/EditProfile.tsx";
import PortfolioItem from "@/components/PortfolioItem.tsx";
import defaultBanner from "../assets/Background.png";
import defaultProfile from "../assets/profile/DefaultProfile.png";

function Profile() {
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const location = useLocation();

	// Fetch user data
	const { data, error, isLoading } = useQuery({
		queryKey: ["profile_get"],
		queryFn: () => fetchProfileDetails(currentUser),
	});

	const [bio, setBio] = useState(null);
	const [role, setRole] = useState(null);
	const [genre, setGenre] = useState(null);
	const [rate, setRate] = useState(null);

	useEffect(() => {
		if (location.state) {
			setBio(location.state.bio);
			setRole(location.state.user_role_tags);
			setGenre(location.state.user_genre_tags);
			setRate(location.state.estimate_flat_rate);
		}
	}, [location]);

	// const mutation = useMutation({
	// 	mutationFn: (bodyFormData: any) =>
	// 		mutateProfileDetails(currentUser, bodyFormData),
	// });

	// // Submit form with new profile information
	// const onSubmit = ({
		// profile_image,
		// bio,
		// user_role_tags,
		// user_genre_tags,
		// estimate_flat_rate,
		// portfolio_images,
		// deleted_portfolio_images,
		// videos,
		// deleted_videos,
	// }) => {
	// 	const bodyFormData = new FormData();
	// 	if (profile_image) 
	// 		bodyFormData.append("profile_image", profile_image);
	// 	if (bio) 
	// 		bodyFormData.append("bio", bio);
	// 	if (user_role_tags) 
	// 		bodyFormData.append("user_role_tags", user_role_tags);
	// 	if (user_genre_tags) 
	// 		bodyFormData.append("user_genre_tags", user_genre_tags);
	// 	if (estimate_flat_rate)
	// 		bodyFormData.append("estimate_flat_rate", estimate_flat_rate);
	// 	if (portfolio_images)
	// 		bodyFormData.append("portfolio_images", portfolio_images);
	// 	if (deleted_portfolio_images)
	// 		bodyFormData.append("deleted_portfolio_images", deleted_portfolio_images);
	// 	if (videos) 
	// 		bodyFormData.append("videos", videos);
	// 	if (deleted_videos)
	// 		bodyFormData.append("deleted_videos", deleted_videos);
	// 	mutation.mutate(bodyFormData);
	// };

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
							<h2>{currentUser?.displayName}</h2>
							<p>{currentUser?.email}</p>
						</div>
						<div>
							<Button className="profile-button" onClick={() => navigate("/profile_settings")}>Profile Settings</Button> 
							<EditProfile />
						</div>
					</div>
				</div>
				
				<div className="profile-row">
					<div className="profile-left">
						<h3>About Me</h3>
					</div>
					<div className="profile-right bio">
						<p>
							{ bio ? bio : "Tell us about yourself!"}
						</p>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Roles</h3>
					</div>
					<div className="profile-right">
						<div className="profile-tag-list">
							{ role &&
								<Button className="profile-role" disabled={true}>{role}</Button> 
							} 
						</div>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Genres</h3>
					</div>
					<div className="profile-right">
						<div className="profile-tag-list">
							{ genre &&
								<Button className="profile-genre" disabled={true}>{genre}</Button> 
							} 
						</div>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Average Rate</h3>
					</div>
					<div className="profile-right bio">
						<p>
							{rate ? '$50 per gig' : 'N/A'}
						</p>
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
