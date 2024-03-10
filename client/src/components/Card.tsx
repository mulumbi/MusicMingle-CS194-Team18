// Card.tsx
import React from 'react';
import { Gig } from "../api/types.ts";
import DefaultEvent from "../assets/home/placeholderEvent.jpg";

type CardProps = {
  gig: Gig;
};

const Card: React.FC<CardProps> = ({ gig }) => {
  const imageUrl = gig.gigImages.length > 0 ? gig.gigImages[0].public_url : DefaultEvent;
  const eventDate = new Date(gig.event_start).toLocaleDateString();
  const eventTime = `${new Date(gig.event_start).toLocaleTimeString()} - ${new Date(gig.event_end).toLocaleTimeString()}`;

  return (
    <div className="card">
      <img
        src={imageUrl || DefaultEvent}
        alt="Event Photo"
      />
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

