
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
  } from "@/components/ui/card";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { IoMdAddCircle } from "react-icons/io";

import FilterSidebarGig from "@/components/Filterbar";



function EventsList() {
	return (
	  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
		<h1 style={{ textAlign: 'center' }}>Discover Gigs</h1>
  
		{/* Search Bar and Content Container */}
		<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
		  {/* Left Side Content */}
		  <div style={{ width: '66%', display: 'flex', flexDirection: 'column' }}>
			{/* Search Bar */}
			<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
			  <Input
				placeholder="Search"
				style={{ marginRight: '8px' }} // Add some space between the input and the button
			  />
			  <Button type="submit">
				<PiMagnifyingGlassBold />
			  </Button>
			</div>
  
			{/* New Event */}
			<div style={{ marginBottom: '20px' }}>
			  <Card style={{ border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
				<CardHeader>
				  <CardTitle>Create new gig</CardTitle>
				</CardHeader>
				<CardContent>
				  <CardDescription> Set up your own gig here now! </CardDescription>
				</CardContent>
				<CardFooter>
				  <Button
					variant="destructive"
					onClick={() =>
					  toast.success("Gig has been created", {
						description: "Sunday, June 03, 2024 at 9:00 PM",
						action: {
						  label: "Undo",
						  onClick: () => console.log("Undo"),
						},
					  })
					}
				  >
					CREATE <IoMdAddCircle />
				  </Button>
				</CardFooter>
				<Toaster position="top-center" richColors/>
			  </Card>
			</div>
  
			{/* Event Container */}
			<div>
			  <Card style={{
				border: '1px solid #ccc', 
				boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
				display: 'flex', 
				flexDirection: 'row', 
				alignItems: 'flex-start' 
			  }}>
				{/* Image Container */}
				<div style={{ minWidth: '200px', maxWidth: '30%', overflow: 'hidden' }}>
				  <img src="https://stanforddaily.com/wp-content/uploads/2022/05/IMG_5407.jpg" alt="Event" style={{ width: '100%', height: 'auto' }} />
				</div>
  
				{/* Text Content Container */}
				<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
				  <CardHeader>
					<CardTitle>Frosh Fest 2024</CardTitle>
				  </CardHeader>
				  <CardContent>
					<CardDescription> This year’s event will host over 2000 attendees, well over 50 breweries from across the region, food trucks, bands and vendors for what will be a true celebration of craft beer, art, and community. It is important to note that Frost Fest will take place regardless of the weather. </CardDescription>
				  </CardContent>
				  <CardFooter>
					<Button variant="secondary">Jazz</Button> <Button variant="secondary">Rock</Button> <Button variant="secondary">Pop</Button>
				  </CardFooter>
				</div>
			  </Card>
			</div>

			{/* second event */}

			<div>
			  <Card style={{
				border: '1px solid #ccc', 
				boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
				display: 'flex', 
				flexDirection: 'row', 
				alignItems: 'flex-start' 
			  }}>
				{/* Image Container */}
				<div style={{ minWidth: '200px', maxWidth: '30%', overflow: 'hidden' }}>
				  <img src="https://www.sfcv.org/sites/default/files/u36849/xCatalina.png.pagespeed.ic.C4GpEqvNmv.jpg" alt="Event" style={{ width: '100%', height: 'auto' }} />
				</div>
  
				{/* Text Content Container */}
				<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
				  <CardHeader>
					<CardTitle>Stanford Classical Ensembles</CardTitle>
				  </CardHeader>
				  <CardContent>
					<CardDescription> The Department of Music hosts many performing ensembles and combos. Some ensembles are open to community members. Be prepared to play études, a sonata, a concerto excerpt, or anything else that demonstrates your abilities.  </CardDescription>
				  </CardContent>
				  <CardFooter>
					<Button variant="secondary">Jazz</Button>  <Button variant="secondary">Classical</Button> 
				  </CardFooter>
				</div>
			  </Card>
			</div>
			
		  </div>

		  
		  
  
		  {/* Filter Sidebar on the Right */}
		  <FilterSidebarGig />
		</div>
	  </div>
	);
  }

  
export default EventsList;


