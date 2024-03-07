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
import { min } from "date-fns";
import { Artist } from "../api/types";


function Artists() {
	const navigate = useNavigate();
	const viewProfile = (artistId: string) => { 
		navigate(`/artists/artist_id=${artistId}`);
	};

	
	const [searchName, setSearchName] = useState("");
	const [roleTags, setRoleTags] = useState<string[]>([]);
	const [minFlatRate, setMinFlatRate] = useState<number | null>(null);
	const [maxFlatRate, setMaxFlatRate] = useState<number | null>(null);


	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["artists", searchName, minFlatRate, maxFlatRate],
		queryFn: () =>
			fetchArtists({ name: searchName, user_role_tags: roleTags, min_flat_rate: minFlatRate, max_flat_rate: maxFlatRate}),
		enabled: false,
	});

	// useEffect(() => {
	// 	refetch();
	// },  [searchName, roleTags, minFlatRate, maxFlatRate]);

	useEffect(() => {
		refetch();
		console.log("Here's the new data after filter: ", data);	
	}, [searchName, roleTags, minFlatRate, maxFlatRate]); 


	const handleSubmit = () => {
		console.log("refetch");
		refetch();
	};

	const handleApplyFilters = (minRate: number | null, maxRate: number | null) => {
		setMinFlatRate(minRate);
		setMaxFlatRate(maxRate);
		refetch();
	}

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
				onApplyFilters={handleApplyFilters}

			/>
		</div>
	);
}

export default Artists;
