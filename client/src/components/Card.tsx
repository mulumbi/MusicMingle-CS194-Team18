// Card.tsx
import React from 'react';

type CardProps = {
  image: string;
  header: string;
  date: string;
  time: string;
  tags: string[];
};

const Card: React.FC<CardProps> = ({ image, header, date, time, tags }) => (
  <div className="card">
    <img src={image} alt={header} />
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
