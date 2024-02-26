import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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

const artists = [
    {
        imageUrl: "https://web.stanford.edu/group/calypso/cgi-bin/images/feelin_it.jpg",
        title: "Cardinal Calypso",
        bio: "Cardinal calypso is Stanford University's steelpan ensemble. Founded in 2005, it may be seen anywhere around the greater Stanford campus, causing wanton happiness and general excitement.",
        tags: ["Steelpan", "Jazz"],
		buttonText: "View Profile",
    },
    {
        imageUrl: "https://history.stanford.edu/sites/history/files/styles/custm_medium_scale_360px_upscaling_allowed_/public/media/image/news/hume_humanities.jpg?itok=5v0SGA_H",
        title: "Ravi Veriah Jacques",
        bio: "Beyond the academic world, Ravi is a talented violinist; he studies with Robin Sharp in the Department of Music and received a Friends of Music scholarship to support those lessons. In 2017, he also won a Stanford Humanities and Sciences Undergraduate Prize in Music.",
        tags: ["Violin", "Classical"],
		buttonText: "View Profile",
    },
    {
        imageUrl: "https://stanforddaily.com/wp-content/uploads/2015/03/AL.030615.SSO_.jpg?w=800",
        title: "Jennie Yang",
        bio: "Jennie has immersed herself in a variety of academic and artistic pursuits, often operating in the intersections between those interests. She is a longtime violist in the Stanford Symphony Orchestra, as well as a dancer in the Opening Committee of the 2020 Viennese Ball.",
        tags: ["Violin", "Classical"],
		buttonText: "View Profile",
    },
];

function Artists() {
    return (
        <div className="App" id="ArtistPageApp" >
            <div>
            <div className="Title" style={{margin: "20px"}}>Discover Artists</div>
            <div id="ArtistBody" >
                <div className="Artist-page-cards">
                    <div style = {{textAlign: "center"}}>
                        <Input placeholder="Search" />
                        <Button type="submit">
                            <PiMagnifyingGlassBold />
                        </Button>
                    </div>
                    {artists.map((artist, index) => (
                        <GigCard key={index} imageUrl={artist.imageUrl} title={artist.title} bio={artist.bio} tags={artist.tags} buttonText={artist.buttonText}
						onButtonClick={() => console.log('Button Clicked')}
						/>
                    ))}
                </div>
               
            </div>
            </div>
            <FilterSidebarArtist />
            
        </div>
    );
}

export default Artists;