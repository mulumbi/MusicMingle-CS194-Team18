import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GigCard from "@/components/GigCards";


const gigs = [
  {
    imageUrl: 'path/to/image1.jpg',
    title: 'Gig Title 1',
    bio: 'This is a short bio for Gig 1',
    tags: ['Tag1', 'Tag2'],
    buttonText: 'Withdraw Application',
  },
  {
    imageUrl: 'path/to/image2.jpg',
    title: 'Gig Title 2',
    bio: 'This is a short bio for Gig 2',
    tags: ['Tag1'],
    buttonText: 'Withdraw Application',
  },
  {
    imageUrl: 'path/to/image1.jpg',
    title: 'Gig Title 1',
    bio: 'This is a short bio for Gig 1',
    tags: ['Tag1', 'Tag2'],
    buttonText: 'Withdraw Application',
  },
];

function MyGigs() {
  return (
    <div className="App">
      <div className="page-body">
        <div className="Title">View My Gigs</div>
        <div className="Selection-tabs">
          <button className="selection-buttons Active">APPLIED GIGS</button>
          <button className="selection-buttons">POSTED GIGS</button>
        </div>
        <div className="my-gigs-cards">
          {/* Content here will depend on the state or context providing the gigs */}
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
      </div>
    </div>
  );
}

export default MyGigs;