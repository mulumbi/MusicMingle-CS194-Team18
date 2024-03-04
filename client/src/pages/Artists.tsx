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

// const artists = [
//     {
//         profile_image: "https://web.stanford.edu/group/calypso/cgi-bin/images/feelin_it.jpg",
//         name: "Cardinal Calypso",
//         bio: "Cardinal calypso is Stanford University's steelpan ensemble. Founded in 2005, it may be seen anywhere around the greater Stanford campus, causing wanton happiness and general excitement.",
//         user_role_tags: ["Singer", "Pianist"],
//         user_genre_tags: ["Steelpan", "Jazz"],
// 		buttonText: "View Profile",
//     },
//     {
//         profile_image: "https://history.stanford.edu/sites/history/files/styles/custm_medium_scale_360px_upscaling_allowed_/public/media/image/news/hume_humanities.jpg?itok=5v0SGA_H",
//         name: "Ravi Veriah Jacques",
//         bio: "Beyond the academic world, Ravi is a talented violinist; he studies with Robin Sharp in the Department of Music and received a Friends of Music scholarship to support those lessons. In 2017, he also won a Stanford Humanities and Sciences Undergraduate Prize in Music.",
//         user_role_tags: ["Singer", "Pianist"],
//         user_genre_tags: ["Violin", "Classical"],
// 		buttonText: "View Profile",
//     },
//     {
//         profile_image: "https://stanforddaily.com/wp-content/uploads/2015/03/AL.030615.SSO_.jpg?w=800",
//         name: "Jennie Yang",
//         bio: "Jennie has immersed herself in a variety of academic and artistic pursuits, often operating in the intersections between those interests. She is a longtime violist in the Stanford Symphony Orchestra, as well as a dancer in the Opening Committee of the 2020 Viennese Ball.",
//         user_role_tags: ["Singer", "Pianist"],
//         user_genre_tags: ["Violin", "Classical"],
// 		buttonText: "View Profile",
//     },
// ];

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
