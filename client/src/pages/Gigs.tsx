import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
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
import FilterSidebarGig from "@/components/Filterbar";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import GigCard from "@/components/GigCards";
import NewGig from "../assets/gigs/add.png";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

const gigs = [
	{
		imageUrl:
			"https://stanforddaily.com/wp-content/uploads/2022/05/IMG_5407.jpg",
		title: "Frosh Fest 2024",
		bio: "This year’s event will host over 2000 attendees, well over 50 breweries from across the region, food trucks, bands, and vendors for what will be a true celebration of craft beer, art, and community. It is important to note that Frost Fest will take place regardless of the weather.",
		tags: ["Jazz", "Rock", "Pop"],
		buttonText: "Learn More",
	},
	{
		imageUrl:
			"https://www.sfcv.org/sites/default/files/u36849/xCatalina.png.pagespeed.ic.C4GpEqvNmv.jpg",
		title: "Stanford Classical Ensembles",
		bio: "The Department of Music hosts many performing ensembles and combos. Some ensembles are open to community members. Be prepared to play études, a sonata, a concerto excerpt, or anything else that demonstrates your abilities.",
		tags: ["Jazz", "Classical"],
		buttonText: "Learn More",
	},
	// Add more gigs as necessary
];

function EventsList() {
	const navigate = useNavigate(); // Get the navigate function

	// Define a function to handle the button click
	const goToCreateGig = () => {
		navigate("/create-gig"); // Use the navigate function to change routes
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
					Discover Gigs
				</div>
				<div id="ArtistsBody">
					<div className="Artist-page-cards">
						<div style={{ textAlign: "center" }}>
							<Input placeholder="Search" />
							<Button type="submit">
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

						{gigs.map((gig, index) => (
							<GigCard
								key={index}
								imageUrl={gig.imageUrl}
								title={gig.title}
								bio={gig.bio}
								tags={gig.tags}
								buttonText={gig.buttonText}
								onButtonClick={() =>
									console.log("Button Clicked")
								}
							/>
						))}
					</div>
				</div>
			</div>
			<FilterSidebarGig
				minBudget={0}
				maxBudget={10000}
			/>
		</div>
	);
}

export default EventsList;
