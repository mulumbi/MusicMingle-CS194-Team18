import React from 'react';
import './GigCard.css'; // Make sure the path is correct

interface GigCardProps {
  imageUrl: string;
  title: string;
  bio: string;
  tags: string[]; // Added to allow for a variable number of tags
}

const GigCard: React.FC<GigCardProps> = ({ imageUrl, title, bio, tags }) => (
  <div className="my-gig-cards">
    <img src={imageUrl} alt="Gig" />
    <div className="gig-details">
      <div className="gig-header">{title}</div>
      <p className="gig-bio">{bio}</p>
      <div className="gig-bottoms">
        <div className="gig-tabs">
          {/* Dynamically generate spans for each tag */}
          {tags.map((tag, index) => (
            <span key={index} className='tab'>{tag}</span>
          ))}
        </div>
        <div className="bottom-buttons">
          <button>Withdraw Application</button>
        </div>
      </div>
    </div>
  </div>
);

export default GigCard;
