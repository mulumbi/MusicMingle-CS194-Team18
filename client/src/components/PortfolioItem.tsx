// PortfolioItem.tsx
import React from 'react';
import { RxCross2 } from "react-icons/rx";

type PortfolioItemProps = {
  image?: { public_url: string };
  video?: { url: string; title: string };
};

const PortfolioItem: React.FC<PortfolioItemProps> = (props) => (
  <div className="portfolio-item">
    <button className="icon-button" type="button" aria-label="Close">
      <RxCross2/>
    </button>
    { props.image && 
        <img src={props.image.public_url} />
    }
    { props.video && 
        <img src={props.video.url} />
    }
  </div>
);

export default PortfolioItem;
