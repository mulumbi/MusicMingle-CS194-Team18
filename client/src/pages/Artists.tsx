import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
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
import axios from "axios";

function Artists() {
	const navigate = useNavigate();
	const viewProfile = (artistId: string) => {
		navigate(`/artists/${artistId}`);
	};

	const [searchName, setSearchName] = useState("");
	const [minFlatRate, setMinFlatRate] = useState<number>(0);
	const [maxFlatRate, setMaxFlatRate] = useState<number>(10000);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]); 
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

	const { data: artists, isLoading, error, refetch } = useQuery({
		queryKey: [
			"artists",
			{
				name: searchName,
				flat_rate_start: minFlatRate,
				flat_rate_end: maxFlatRate,
				selectedRoles, 
				selectedGenres 
			},
		],
		queryFn: () =>
			fetchArtists({
				name: searchName,
				flat_rate_start: minFlatRate,
				flat_rate_end: maxFlatRate,
				user_role_tags: selectedRoles,
				user_genre_tags: selectedGenres,
			}),
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, [searchName, minFlatRate, maxFlatRate, selectedGenres, selectedRoles]);

	const handleSubmit = () => {
		refetch();
	};

	return (
		<div
			className="App"
			id="ArtistPageApp"
		>
						<div className="page-body">
						<div className="header-search">
					<h2 className="header-title">Discover Artists </h2>
					<div className="searchbar">
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
				</div>
						
			<div className="main-artist-page">

				<div id="ArtistBody">
					<div className="Artist-page-cards">
						{artists?.map((artist, index) => (
							<Link to={"/artists/" + artist.id}>
								<GigCard
									key={index}
									imageUrl={
										artist.profileImage[0]?.public_url || ""
									}
									title={artist.name}
									bio={artist.bio}
									tags={artist.user_genre_tags.concat(
										artist.user_role_tags
									)}
									buttonText="View Profile"
									onButtonClick={() => viewProfile(artist.id)}
								/>
							</Link>
						))}
					</div>
				</div>
				<FilterSidebarArtist
				minRate={minFlatRate}
				maxRate={maxFlatRate}
				selectedRoles={selectedRoles}
				selectedGenres={selectedGenres}
				onApplyFilters={(newMinFlatRate, newMaxFlatRate, newSelectedRoles, newSelectedGenres) => {
					setMinFlatRate(newMinFlatRate);
					setMaxFlatRate(newMaxFlatRate);
					setSelectedRoles(newSelectedRoles);
					setSelectedGenres(newSelectedGenres);
					refetch();
				}}
			/>
			</div>
		</div>
		</div>
	);
}

export default Artists;