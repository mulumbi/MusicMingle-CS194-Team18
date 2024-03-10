import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterSidebarGig from "@/components/Filterbar";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import GigCard from "@/components/GigCards";
import NewGig from "../assets/home/add.png";
import { useQuery } from "@tanstack/react-query";
import { fetchGigs, fetchGigByName } from "../api/gigs.api";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function EventsList() {
	const navigate = useNavigate(); // Get the navigate function
	const viewProfile = (gigId: string) => {
		navigate(`/gigs/${gigId}`);
	}
	const { currentUser } = useContext(AuthContext);

	// Define a function to handle the button click
	const goToCreateGig = () => {
		navigate("/create-gig"); // Use the navigate function to change routes
	};

	const [searchName, setSearchName] = useState("");
	const [minBudget, setMinBudget] = useState<number>(0);
	const [maxBudget, setMaxBudget] = useState<number>(10000);


	const {
		data: gigs,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: [
			"gigs",
			{ name: searchName, min_budget: minBudget, max_budget: maxBudget },
		],
		queryFn: () =>
			fetchGigs({
				name: searchName,
				min_budget: minBudget,
				max_budget: maxBudget,

			}),
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, [searchName, minBudget, maxBudget]);

	const handleSubmit = () => {
		refetch();
	};

	const applyToGig = async (gigTitle, currentUser) => {
		try {
			// Use fetchGigByName to get the gig object
			const gig = await fetchGigByName(gigTitle);
			const gigId = gig.id; // Assuming the 'id' field is present in the gig object

			// Ensure currentUser is available and has a method to get an ID token
			const token = await currentUser.getIdToken();

			// Post application using the retrieved gig ID
			await axios.post(`${import.meta.env.VITE_BACKEND_URL}/gigs/application/?gig_id=${gigId}`, {}, {
				headers: {
					'Authorization': `Bearer ${token}`, // Assuming Bearer token is required; adjust as necessary
					'Content-Type': 'application/json'
				}
			});

			alert('Application submitted successfully!');
		} catch (error) {
			console.error('Error applying to gig:', error);
			alert('Failed to submit application.');
		}
	};

	console.log(gigs);
	return (
		<div
			className="App"
			id="ArtistPageApp"
		>
			<div className="main-artist-page">
				<div className="header-search">
					<h2 className="Title">Discover Gigs </h2>
					<div className="searchbar">
						<Input
							placeholder="Search"
							value={searchName}
							onChange={(e) => setSearchName(e.target.value)}
						/>
						<Button
							type="submit"
							onClick={handleSubmit}
						>
							<PiMagnifyingGlassBold />
						</Button>
					</div>
				</div>
				<div id="ArtistBody">
					<div className="Artist-page-cards">
						<Link to="/create_gig">
							<GigCard
								imageUrl={NewGig} // Placeholder image
								title="Create New Gig"
								bio="Set up your own gig here now!"
								tags={["Create", "New"]} // Placeholder tags
								buttonText="Create"
								onButtonClick={goToCreateGig}
							/>
						</Link>

						{gigs?.map((gig, index) => (
							<Link to={"/gigs/" + gig.id}>
								<GigCard
									key={index}
									imageUrl={gig?.gigProfileImage?.public_url || ""}
									title={gig.name}
									bio={gig.bio}
									tags={gig.gig_role_tags.concat(gig.gig_genre_tags)}
									buttonText="Apply Now"
									onButtonClick={() => applyToGig(gig.name, currentUser)}
								/>
							</Link>
							
						))}
					</div>
				</div>
			</div>
			<FilterSidebarGig
				minBudget={minBudget}
				maxBudget={maxBudget}

				onApplyFilters={(newMinBudget, newMaxBudget) => {
					setMinBudget(newMinBudget);
					setMaxBudget(newMaxBudget);
					refetch();

				}} />
		</div>

	);
}

export default EventsList;
