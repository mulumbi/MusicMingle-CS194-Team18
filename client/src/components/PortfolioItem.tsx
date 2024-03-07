// PortfolioItem.tsx
import React from 'react';
import { RxCross2 } from "react-icons/rx";

type PortfolioItemProps = {
  image?: { public_url: string };
  video?: { public_url: string };
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
        <video width="400" preload="metadata" controls={true}>
          <source src={props.video.public_url} type="video/mp4" />
        </video>
    }
  </div>
);

export default PortfolioItem;
