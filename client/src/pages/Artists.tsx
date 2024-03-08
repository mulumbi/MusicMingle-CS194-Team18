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

function Artists() {
	const [searchName, setSearchName] = useState("");
	const [roleTags, setRoleTags] = useState<string[]>([]);

	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["artists"],
		queryFn: () =>
			fetchArtists({ name: searchName, user_role_tags: roleTags }),
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, []);

	const handleSubmit = () => {
		console.log("refetch");
		refetch();
	};
	console.log(data);
	return (
		<div
			className="App"
			id="ArtistPageApp"
		>
			<div className="main-artist-page">
				<div className="header-search">
					<h2  className="Title">Discover Artists </h2>
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
				<div id="ArtistBody">
					<div className="Artist-page-cards">

						{data?.map((artist, index) => (
							<GigCard
								key={index}
								// imageUrl={artist.profile_image}
								imageUrl={
									artist.profile_image?.public_url || ""
								}
								title={artist.name}
								bio={artist.bio}
								tags={artist.user_genre_tags.concat(
									artist.user_role_tags
								)}
								buttonText="View Profile"
								onButtonClick={() =>
									console.log("Artist Clicked", artist.name)
								}
							/>
						))}
					</div>
				</div>
			</div>
			<FilterSidebarArtist rate={5} />
		</div>
	);
}

export default Artists;
