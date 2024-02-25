
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
import Gig1 from "../assets/gigs/add.png";



const gigs = [
    {
        imageUrl: "https://stanforddaily.com/wp-content/uploads/2022/05/IMG_5407.jpg",
        title: "Frosh Fest 2024",
        bio: "This year’s event will host over 2000 attendees, well over 50 breweries from across the region, food trucks, bands, and vendors for what will be a true celebration of craft beer, art, and community. It is important to note that Frost Fest will take place regardless of the weather.",
        tags: ["Jazz", "Rock", "Pop"],
        buttonText: "Learn More" 
    },
    {
        imageUrl: "https://www.sfcv.org/sites/default/files/u36849/xCatalina.png.pagespeed.ic.C4GpEqvNmv.jpg",
        title: "Stanford Classical Ensembles",
        bio: "The Department of Music hosts many performing ensembles and combos. Some ensembles are open to community members. Be prepared to play études, a sonata, a concerto excerpt, or anything else that demonstrates your abilities.",
        tags: ["Jazz", "Classical"],
        buttonText:  "Learn More" 
    },
    // Add more gigs as necessary
];

const navigate = useNavigate(); // This hook gives you access to the navigate function

const handleCreateGig = () => {
	navigate('/create-gig'); // Use the path to your CreateGig page
};

function EventsList() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <h1 style={{ textAlign: 'center' }}>Discover Gigs</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div style={{ width: '66%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <Input placeholder="Search" style={{ marginRight: '8px' }} />
                        <Button type="submit">
                            <PiMagnifyingGlassBold />
                        </Button>
                    </div>

					{/* Create New Gig Card */}
                    <GigCard 
                        imageUrl= {Gig1} 
                        title="Create New Gig"
                        bio="Set up your own gig here now!"
                        tags={["Create", "New"]} // Placeholder tags
                        buttonText="Create"
						onButtonClick={handleCreateGig}
                    />


                    {gigs.map((gig, index) => (
                        <GigCard 
                            key={index} 
                            imageUrl={gig.imageUrl} 
                            title={gig.title} 
                            bio={gig.bio} 
                            tags={gig.tags} 
                            buttonText={gig.buttonText} 
							onButtonClick={() => console.log('Button Clicked')}
                        />
                    ))}
                </div>
                <FilterSidebarGig />
            </div>
            <Toaster position="top-center" richColors/>
        </div>
    );
}

export default EventsList;
  



