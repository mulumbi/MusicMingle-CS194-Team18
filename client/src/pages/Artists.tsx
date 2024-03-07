import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { FilterSidebarArtist } from "../components/Filterbar";
import GigCard from "@/components/GigCards";
import { fetchArtists } from "../api/artists.api";
import { useNavigate } from 'react-router-dom';



function Artists() {
	const navigate = useNavigate();
	const viewProfile = (artistId: string) => { 
		navigate(`/artists/artist_id=${artistId}`);
	};

	const [searchName, setSearchName] = useState("");
	const [minFlatRate, setMinFlatRate] = useState<number>(0);
	const [maxFlatRate, setMaxFlatRate] = useState<number>(10000);


	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["artists", {name: searchName,  flat_rate_start: minFlatRate, flat_rate_end: maxFlatRate},],
		queryFn: () =>
			fetchArtists({ 
				name: searchName, 
				flat_rate_start: minFlatRate, 
				flat_rate_end: maxFlatRate}),
		enabled: false,
	});


	useEffect(() => {
		refetch();
	}, [searchName, minFlatRate, maxFlatRate]); 


	const handleSubmit = () => {
		refetch();
	};

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
					Discover Artists
				</div>
				<div id="ArtistBody">
					<div className="Artist-page-cards">
						<div style={{ textAlign: "center" }}>
							<Input
								placeholder="Search"
								value={searchName}
								onChange={(e) => setSearchName(e.target.value)}
							/>
							<Button
								type="submit"
								onClick={() => handleSubmit()}
							>
								<PiMagnifyingGlassBold />
							</Button>
						</div>

						{data?.map((artist, index) => (
							<GigCard
								key={index}
								imageUrl={artist.profileImage?.public_url || ""}
								title={artist.name}
								bio={artist.bio}
								tags={artist.user_genre_tags.concat(
									artist.user_role_tags
								)}
								buttonText="View Profile"
								onButtonClick={() =>
									viewProfile(artist.id)}
							/>
						))}
					</div>
				</div>
			</div>
			<FilterSidebarArtist
				minRate={minFlatRate}
				maxRate={maxFlatRate}
				onApplyFilters={(newMinFlatRate, newMaxFlatRate) => {
					setMinFlatRate(newMinFlatRate);
					setMaxFlatRate(newMaxFlatRate);
					refetch();
					console.log("data after filters", data);
				}}

			/>
		</div>
	);
}

export default Artists;
