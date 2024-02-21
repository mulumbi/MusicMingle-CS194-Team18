// Home.tsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card"; // Assuming your environment resolves .tsx
import "../App.css";
import Gig1 from "../assets/gigs/add.png";
import Gig2 from "../assets/gigs/2.jpg";
import Gig3 from "../assets/gigs/3.jpg";
import Gig4 from "../assets/gigs/4.jpg";
import Gig5 from "../assets/gigs/5.jpeg";
import artists1 from "../assets/artists/1.jpg";
import artists2 from "../assets/artists/2.jpg";
import artists3 from "../assets/artists/3.jpg";
import artists4 from "../assets/artists/4.jpg";
import artists5 from "../assets/artists/5.jpg";


function Home() {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const gigCardsData = [
      {
        id: 'g1',
        image: Gig1,
        header: 'Create New Gig',
        date: 'Do you have an event coming up?',
        time: 'Find local talent for your next gig!',
        tags: ['Genre', 'Type'],
      },
      {
        id: 'g2',
        image: Gig2,
        header: 'Frost Fest 2024 Opener',
        date: 'March 17th',
        time: '4:00 PM - 10:00 PM',
        tags: ['Pop', 'Indie Rock', 'Bands'],
      },
      {
        id: 'g3',
        image: Gig3,
        header: 'Stanford Classical Ensemble',
        date: 'February 29th',
        time: '2:00 PM - 4:00 PM',
        tags: ['Cellist', 'Opera Singer'],
      },
      {
        id: 'g4',
        image: Gig4,
        header: 'Friday nights @ Coho',
        date: 'March 5th',
        time: '8 PM - 12:30 AM',
        tags: ['Acapella', 'Acoustic'],
      },
      {
        id: 'g5',
        image: Gig5,
        header: 'Senior Commencement',
        date: 'June 30th',
        time: '8 AM - 2:00 PM',
        tags: ['Orchestra', 'Chorale'],
      }
    ];

    // Dummy data for artist cards remains the same
    const artistCardsData =[
			{
			  id: 'ga1',
			  image: artists1,
			  header: 'Andrea Sephile',
			  date: 'Lorem ipsum dolor sit amet ',
			  time: 'consectetur. Rhoncus amet tellus.',
			  tags: ['Genre', 'Type'],
			},
			{
			  id: 'ga2',
			  image: artists2,
			  header: 'Austin parks Jr',
			  date: 'Lorem ipsum dolor sit amet ',
			  time: 'consectetur. Rhoncus amet tellus.',
			  tags: ['Pop', 'Indie Rock', 'Bands'],
			},
			{
			  id: 'ga3',
			  image: artists3,
			  header: 'Kelly Mikel',
			  date: 'Lorem ipsum dolor sit amet ',
			  time: 'consectetur. Rhoncus amet tellus.',
			  tags: ['Cellist', 'Opera Singer'],
			},
			{
			  id: 'ga4',
			  image: artists4,
			  header: 'Celine Melvado',
			  date: 'Lorem ipsum dolor sit amet ',
			  time: 'consectetur. Rhoncus amet tellus.',
			  tags: ['Acapella', 'Acoustic'],
			},
			{
			  id: 'ga5',
			  image: artists5,
			  header: 'Singer Bandina',
			  date: 'Lorem ipsum dolor sit amet ',
			  time: 'consectetur. Rhoncus amet tellus.',
			  tags: ['Orchestra', 'Chorale'],
			}
		  ];
	  

    return (
        <div className="App">
            <div className="gig-cards">
                <div className="title">
                    <h1>Discover Gigs</h1>
                    <button onClick={() => navigate("/gigs")}>Show all</button>
                </div>
                <div className="cards">
                    {gigCardsData.map(card => (
                        <Card key={card.id} {...card} />
                    ))}
                </div>
            </div>
            <div className="artist-cards">
                <div className="title">
                    <h1>Discover Artists</h1>
                    <button onClick={() => navigate("/artists")}>Show all</button>
                </div>
                <div className="cards">
                    {artistCardsData.map(card => (
                        <Card key={card.id} {...card} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;