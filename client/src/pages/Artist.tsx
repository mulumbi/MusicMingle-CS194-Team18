import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading.tsx";
import PortfolioItem from "@/components/PortfolioItem.tsx";
import SharePage from "@/components/SharePage";
import ComingSoon from "@/components/ComingSoon.tsx";
import defaultBanner from "../assets/Background.png";
import defaultProfile from "../assets/profile/DefaultProfile.png";
import { fetchArtist } from "../api/artists.api";

function Artist() {
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
				alt="Profile Banner"
			/>
			<div className="profile-main">
				<div className="profile-row">
					<div className="profile-left">
						<img
							className="profile-photo"
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
                            <h1>{data?.name}</h1>
							<div className="organizer-row">
								{data?.email}
							</div>
						</div>
						<div className="profile-actions">
							<ComingSoon name="Message" />
							<SharePage id={id} category="artists" />
						</div>
					</div> 
				</div>

				{data?.bio && (
					<div className="profile-row">
						<div className="profile-left">
							<h3>About Me</h3>
						</div>
						<div className="profile-right bio">
							<p>{data.bio}</p>
						</div>
					</div>
				)}

				{data?.user_role_tags && (
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
				)}

				{data?.user_genre_tags && (
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
				)}

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

				{(data?.portfolioImages || data?.portfolioVideos) && (
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
				)}
				
			</div>
		</div>
	);
}
export default Artist;
