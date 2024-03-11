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
import defaultGig from "../assets/home/placeholderEvent.jpg";
// import defaultGig from "../assets/gigs/DefaultGig.png";
import { fetchGig, mutateApplication, ApplyToGig } from "../api/gigs.api";
import { fetchArtist } from "../api/artists.api";
import { signInWithGooglePopup } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";

function Gig() {
	const { id } = useParams();
	console.log("id", id);
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	// Fetch gig data
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["gig_get"],
		queryFn: () => fetchGig(id, currentUser),
		enabled: false,
	});

	const { mutate, error, isPending } = useMutation({
		mutationFn: () => mutateApplication(currentUser, id),
		onSuccess: () => refetch(),
	});

	const applyMutation = useMutation({
		mutationFn: (applicationDetails) => ApplyToGig(id, applicationDetails, currentUser),
		onSuccess: () => {
		  // Handle successful application
		  setShowSuccessModal(true);
		},
	  });
	

	const onApply = () => {
		const applicationDetails = {
			applicantId: currentUser.uid,
			gigId: id,
			// Add more details as needed
		  };
	  
		  applyMutation.mutate(applicationDetails);
		  mutate();
	};

	// Fetch on firstApplyTo page load
	useEffect(() => {
		refetch();
	}, []);

	console.log("loading", isLoading);
	console.log("data", data);
	console.log("error", error);

	// Fetch organizer user data
	const organizerResults = useQuery({
		queryKey: ["artist_get"],
		queryFn: () => fetchArtist(data.UserId),
		enabled: false,
	});

	// Fetch once data is loaded
	useEffect(() => {
		organizerResults.refetch();
	}, [data]);

	// Parse date and times
	const startDateTime = new Date(data?.event_start);
	const startDate = startDateTime.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		weekday: "short",
	});
	const startTime = startDateTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const endDateTime = new Date(data?.event_end);
	const endDate = endDateTime.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		weekday: "short",
	});
	const endTime = endDateTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});

	// success modal
	const SuccessModal = () => (
		// Modal backdrop
		<div className="modal-backdrop" onClick={() => setShowSuccessModal(false)}>
		  {/* Modal content*/}
		  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
			<p>Applied to Gig Successfully</p>
			<div className="modal-actions">
			  <Button onClick={() => navigate("/gigs")}>Go to Discover Gigs</Button>
			  <Button onClick={() => navigate("/my_gigs")}>View on My Gigs</Button>
			</div>
		  </div>
		</div>
	  );
	  
	// Loading screen
	if (isLoading) return <Loading />;

	return (
		<div className="profile-page">
			<img
				className="profile-banner"
				src={defaultBanner}
				alt="Gig Banner"
			/>
			<div className="profile-main">
				<div className="profile-row">
					<div className="profile-left">
						<img
							className="gig-photo"
							src={
								data?.gigProfileImage
									? data?.gigProfileImage.public_url
									: defaultGig
							}
							alt="Gig Photo"
						/>
					</div>
					<div className="profile-right">
						<div>
							<h1>{data?.name}</h1>
							<div className="organizer-row">
								Posted by {organizerResults?.data?.name}
							</div>
						</div>
						<div className="profile-actions">
							<Button
								className="pending-button"
								onClick={() => onApply()}
							>
								{data?.application
									? "Remove Application"
									: "Apply"}
							</Button>
							{showSuccessModal && <SuccessModal />}
							<SharePage
								id={id}
								category="gigs"
							/>
						</div>
					</div>
				</div>

				<div className="profile-row">
					<div className="profile-left">
						<h3>Date & Time</h3>
					</div>
					<div className="profile-right">
						{data?.event_start && (
							<div className="date-time-row">
								<div className="date">{startDate}</div>
								{startTime + " - "}
								{endDate != startDate && (
									<div className="date">{endDate}</div>
								)}
								{endTime}
							</div>
						)}
					</div>
				</div>

				{data?.bio && (
					<div className="profile-row">
						<div className="profile-left">
							<h3>Description</h3>
						</div>
						<div className="profile-right bio">
							<p>{data.bio}</p>
						</div>
					</div>
				)}

				{data?.gig_role_tags && (
					<div className="profile-row">
						<div className="profile-left">
							<h3>Roles</h3>
						</div>
						<div className="profile-right">
							<div className="profile-tag-list">
								{data?.gig_role_tags.map((role, index) => (
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

				{data?.gig_genre_tags && (
					<div className="profile-row">
						<div className="profile-left">
							<h3>Genres</h3>
						</div>
						<div className="profile-right">
							<div className="profile-tag-list">
								{data?.gig_genre_tags.map((genre, index) => (
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
						<h3>Budget</h3>
					</div>
					<div className="profile-right bio">
						<p>
							{data?.estimate_flat_rate
								? "$" + data.estimate_flat_rate + " flat rate"
								: "N/A"}
						</p>
					</div>
				</div>

				{data?.gigImages && (
					<div className="profile-row">
						<div className="profile-left">
							<h3>Gallery</h3>
						</div>
						<div className="profile-right">
							<div className="portfolio">
								{data?.gigImages?.map((image, index) => (
									<div key={index} className="portfolio-item">
										<PortfolioItem image={image} viewOnly={true} />
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
export default Gig;
