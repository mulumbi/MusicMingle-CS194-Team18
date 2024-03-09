import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading.tsx";
import PortfolioItem from "@/components/PortfolioItem.tsx";
import defaultBanner from "../assets/Background.png";
import defaultProfile from "../assets/profile/DefaultProfile.png";
import { fetchArtist } from "../api/artists.api";

function Gig() {
    const { id } = useParams();
	const navigate = useNavigate();

	// Fetch user data
    const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["artist_get"],
		queryFn: () =>
			fetchArtist(id),
		enabled: false,
	});

	// Fetch on first page load
	useEffect(() => {
		refetch();
	}, []);

	console.log("loading", isLoading);
	console.log("data", data);
	console.log("error", error);
	
	if (isLoading) return (
		<Loading />
	);
	
	return (
		<div className="profile-page">
			<img
				className="profile-banner"
				src={defaultBanner}
				alt="Profile Photo"
			/>
			<div className="profile-main">
				<div className="profile-row">
					<div className="profile-left">
						<img
							className="profile-photo"
                            src={defaultProfile}
							src={
								data?.profileImage?.length > 0
									? data?.profileImage[0].public_url
									: defaultProfile
							}
							alt="Profile Photo"
						/>
					</div>
					<div className="profile-right">
						<div>    
                            <h2>{data?.name}</h2>
							<p>{data?.email}</p>
						</div>
						<div>
							<Button
								className="profile-button"
							>
								Message
							</Button>
                            <Button
								className="profile-button"
							>
								Share
							</Button>
						</div>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>About Me</h3>
					</div>
					<div className="profile-right bio">
						{data?.bio ? (
							<p>{data.bio}</p>
						) : (
							<p>
								<i>Nothing to see here!</i>
							</p>
						)}
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Roles</h3>
					</div>
					<div className="profile-right">
						<div className="profile-tag-list">
							{data?.user_role_tags.map((role, index) => (
								<Button
									key={index}
									className="profile-role"
									disabled={true}
								>
									{role}
								</Button>
							))}
						</div>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Genres</h3>
					</div>
					<div className="profile-right">
						<div className="profile-tag-list">
							{data?.user_genre_tags.map((genre, index) => (
								<Button
									key={index}
									className="profile-genre"
									disabled={true}
								>
									{genre}
								</Button>
							))}
						</div>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Average Rate</h3>
					</div>
					<div className="profile-right bio">
						<p>
							{data?.estimate_flat_rate
								? "$" + data.estimate_flat_rate + " per gig"
								: "N/A"}
						</p>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Portfolio</h3>
					</div>
					<div className="profile-right">
						<div className="portfolio">
							{data?.portfolioImages?.map((image, index) => (
								<div key={index} className="portfolio-item">
									<PortfolioItem image={image} viewOnly={true} />
								</div>
							))}
							{data?.portfolioVideos?.map((video, index) => (
								<div key={index} className="portfolio-item">
									<PortfolioItem video={video} viewOnly={true} />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Gig;
