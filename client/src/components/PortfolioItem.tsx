// PortfolioItem.tsx
import React from 'react';

type PortfolioItemProps = {
  image?: string;
  video?: { url: string; title: string };
};

const PortfolioItem: React.FC<PortfolioItemProps> = (props) => (
  <div className="portfolio-item">
    { props.image && 
        <img src={props.image} />
    }
    { props.video && 
        <img src={props.video.url} />
    }
  </div>
);

export default PortfolioItem;
