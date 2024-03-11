import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/Card";
import ArtistCard from "../components/ArtistCard";
import "../App.css";
import { Gig, Artist, UserContent } from "../api/types";
import { fetchArtists } from "../api/artists.api";
import { fetchGigs } from "../api/gigs.api";
import Add from "../assets/home/add.png";


function Home() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // Setup state for artists and gigs data
  const [gigCardsData, setGigCardsData] = useState<Gig[]>([]);
  const [artistCardsData, setArtistCardsData] = useState<Artist[]>([]);

  // Placeholder for search filters (assuming these are used in your fetch functions)
  const searchName = "";
  const minFlatRate = 0;
  const maxFlatRate = 10000;

  // Placeholder for the new gig creation
  const NewGigImg: UserContent = {
    id: "ng1",
    file_name: "newGigImg",
    public_url: Add,
  };

  const CreateNewGig: Gig = {
    id: "createnewgig001",
    name: "Create New Gig",
    bio: "Find local talent for your next gig!",
    event_start: "", 
    event_end: "",
    gigImages: [NewGigImg],
    gig_role_tags: [],
    gig_genre_tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: currentUser,
    estimate_flat_rate: 0,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch artists and gigs data
        const artists = await fetchArtists({ name: searchName, flat_rate_start: minFlatRate, flat_rate_end: maxFlatRate });
        const gigs = await fetchGigs({ name: searchName, min_budget: minFlatRate, max_budget: maxFlatRate });

        // Prepend CreateNewGig to the gigs data
        const updatedGigsData = [CreateNewGig, ...gigs].slice(0, 5);
        const updatedArtistsData = artists.slice(0, 6 - updatedGigsData.length);

        setGigCardsData(updatedGigsData);
        setArtistCardsData(updatedArtistsData);
      } catch (error) {
        console.error("Failed to fetch gigs or artists", error);
      }
    };

    loadData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="App">
      <div className="gig-cards">
        <div className="title">
          <h1>Discover Gigs</h1>
          <button onClick={() => navigate("/gigs")}>Show all</button>
        </div>
        <div className="cards">
          {gigCardsData.map((gig, index) => (
            <Card key={gig.id} gig={gig} />
          ))}
        </div>
      </div>
      <div className="artist-cards">
        <div className="title">
          <h1>Discover Artists</h1>
          <button onClick={() => navigate("/artists")}>Show all</button>
        </div>
        <div className="cards">
          {artistCardsData.map((artist, index) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
