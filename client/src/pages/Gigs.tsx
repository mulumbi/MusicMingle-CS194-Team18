import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterSidebarGig from "@/components/Filterbar";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import GigCard from "@/components/GigCards";
import NewGig from "../assets/gigs/add.png";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGigs } from "../api/gigs.api";

function EventsList() {
	const navigate = useNavigate(); // Get the navigate function
	const viewProfile = (gigId: string) => {
		navigate(`/gigs/gig_id=${gigId}`);
	}

	// Define a function to handle the button click
	const goToCreateGig = () => {
		navigate("/create-gig"); // Use the navigate function to change routes
	};

	const [searchName, setSearchName] = useState("");
	const [minBudget, setMinBudget] = useState<number>(0);
	const [maxBudget, setMaxBudget] = useState<number>(10000);
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);


	const {
		data: gigs,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: [
			"gigs",
			{ name: searchName, min_budget: minBudget, max_budget: maxBudget, selectedRoles, selectedGenres },
		],
		queryFn: () =>
			fetchGigs({
				name: searchName,
				min_budget: minBudget,
				max_budget: maxBudget,
				gig_role_tags: selectedRoles,
				gig_genre_tags: selectedGenres,
			}),
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, [searchName, minBudget, maxBudget, selectedRoles, selectedGenres]);

	const handleSubmit = () => {
		console.log({"Here is after filter": searchName, minBudget, maxBudget, selectedRoles, selectedGenres});
		refetch();
	};
	console.log(gigs);
	return (
		<div
			className="App"
			id="ArtistPageApp"
		> 
			<div>
				<div
					className="Title"
					style={{ margin: "20px" }}
				>
					Discover Gigs
				</div>
				<div id="ArtistsBody">
					<div className="Artist-page-cards">
						<div style={{ textAlign: "center" }}>
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
							<GigCard
								key={index}
								imageUrl={gig?.gigProfileImage?.public_url || ""}
								title={gig.name}
								bio={gig.bio}
								tags={gig.gig_role_tags.concat(gig.gig_genre_tags)}
								buttonText="Learn More"
								onButtonClick={() =>
									viewProfile(gig.id)
								}
							/>
						))}
					</div>
				</div>
			</div>
			<FilterSidebarGig
				minBudget={minBudget}
				maxBudget={maxBudget}
				selectedRoles={selectedRoles}
				selectedGenres={selectedGenres}
				onApplyFilters={(newMinBudget, newMaxBudget, newSelectedRoles, newSelectedGenres) => {
					setMinBudget(newMinBudget);
					setMaxBudget(newMaxBudget);
					setSelectedRoles(newSelectedRoles);
					setSelectedGenres(newSelectedGenres);
					refetch();
				}}
			/>

		</div>

	);
}

export default EventsList;
