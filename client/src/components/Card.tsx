import React from 'react';

type CardProps = {
  image: string;
  header: string;
  date: string;
  time: string;
  tags: string[];
  onImageClick?: () => void;
};

const Card: React.FC<CardProps> = ({ image, header, date, time, tags, onImageClick }) => (
  <div className="card">
    {onImageClick ? (
      <button onClick={onImageClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <img src={image} alt={header} style={{ maxWidth: '100%', display: 'block' }}/>
      </button>
    ) : (
      <img src={image} alt={header} style={{ maxWidth: '100%', display: 'block' }}/>
    )}
    <h2>{header}</h2>
    <p>{date}</p>
    <p>{time}</p>
    <div className="tags">
      {tags.map((tag, index) => (
        <span key={index} className="tag">{tag}</span>
      ))}
    </div>
  </div>
);

export default Card;
