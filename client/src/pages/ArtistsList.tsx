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

function ArtistsList() {
 
  return (
	  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
		<h1 style={{ textAlign: 'center' }}>Discover Artists</h1>
  
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
				  <img src="https://web.stanford.edu/group/calypso/cgi-bin/images/feelin_it.jpg" alt="Event" style={{ width: '100%', height: 'auto' }} />
				</div>
  
				{/* Text Content Container */}
				<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
				  <CardHeader>
					<CardTitle>Cardinal Calypso</CardTitle>
				  </CardHeader>
				  <CardContent>
					<CardDescription>Cardinal calypso is stanford university's steelpan ensemble. Founded in 2005, it may be seen anywhere around the greater stanford campus, causing wanton happiness and general excitement. </CardDescription>
				  </CardContent>
				  <CardFooter>
					<Button variant="secondary">Steelpan </Button> <Button variant="secondary">Jazz</Button> 
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
				  <img src="https://history.stanford.edu/sites/history/files/styles/custm_medium_scale_360px_upscaling_allowed_/public/media/image/news/hume_humanities.jpg?itok=5v0SGA_H" alt="Event" style={{ width: '100%', height: 'auto' }} />
				</div>
  
				{/* Text Content Container */}
				<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
				  <CardHeader>
					<CardTitle>Ravi Veriah Jacques </CardTitle>
				  </CardHeader>
				  <CardContent>
					<CardDescription> Beyond the academic world, Ravi is a talented violinist; he studies with Robin Sharp in the Department of Music and received a Friends of Music scholarship to support those lessons. In 2017, He also won a Stanford Humanities and Sciences Undergraduate Prize in Music.   </CardDescription>
				  </CardContent>
				  <CardFooter>
					<Button variant="secondary">Violin</Button>  <Button variant="secondary">Classical</Button> 
				  </CardFooter>
				</div>
			  </Card>
			</div>

      {/* third event */}
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
				  <img src="https://stanforddaily.com/wp-content/uploads/2015/03/AL.030615.SSO_.jpg?w=800" alt="Event" style={{ width: '100%', height: 'auto' }} />
				</div>
  
				{/* Text Content Container */}
				<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
				  <CardHeader>
					<CardTitle> Jennie Yang </CardTitle>
				  </CardHeader>
				  <CardContent>
					<CardDescription>Jennie has immersed herself in a variety of academic and artistic pursuits, often operating in the intersections between those interests. She is a longtime violist in the Stanford Symphony Orchestra, as well as a dancer in the Opening Committee of the 2020 Viennese Ball.      </CardDescription>
				  </CardContent>
				  <CardFooter>
					<Button variant="secondary">Violin</Button>  <Button variant="secondary">Classical</Button> 
				  </CardFooter>
				</div>
			  </Card>
			</div>
			
		  </div>

		  
      <FilterSidebarArtist />

		</div>

	  </div>
	);
}

export default ArtistsList;