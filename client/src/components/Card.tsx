// Card.tsx
import React from 'react';
import { Gig } from "../api/types.ts";
import DefaultEvent from "../assets/home/placeholderEvent.jpg";
import { useNavigate } from 'react-router-dom';

type CardProps = {
  gig: Gig;
};

const Card: React.FC<CardProps> = ({ gig }) => {
  const imageUrl =  gig?.gigProfileImage?.public_url;
  const eventDate = new Date(gig.event_start).toLocaleDateString();
  const eventTime = `${new Date(gig.event_start).toLocaleTimeString()} - ${new Date(gig.event_end).toLocaleTimeString()}`;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/gigs/${gig.id}`);
  };
  

  return (
    <div className="card">
      <button onClick={handleClick} style={{ width:'100%', border: 'none', background: 'none', padding: 0, margin: 0 }}>
        <img
          src={imageUrl || DefaultEvent}
          alt="Event Photo"
        />
      </button>
      <h2>{gig.name}</h2>
      <p>Date: {eventDate}</p>
      <p>Time: {eventTime}</p>
      <div className="tags">
        {gig.gig_role_tags.concat(gig.gig_genre_tags).map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default Card;

