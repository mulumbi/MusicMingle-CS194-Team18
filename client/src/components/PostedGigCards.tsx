import React from "react";
import "./GigCard.css";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/ui/popover";

interface PostedGigCardProps {
        title: string;
      	bio: string;
      	eventStart: string; // Changed to string to match the expected type from API
      	eventEnd: string; // Changed to string to match the expected type from API
      	tags: string[];
        popupButtonText: string;
        popupContent: any;
      	buttonText1: string;
      	onButtonClick1: () => void;
        buttonText2: string;
      	onButtonClick2: () => void;
}

function formatDateTime(dateString: string): string {
      	const date = new Date(dateString);
      	const year = date.getFullYear();
      	const month = date.getMonth() + 1; // Months are 0-indexed, add 1 for human-readable format
      	const day = date.getDate();
      	const hours = date.getHours();
      	const minutes = date.getMinutes();
      	const seconds = date.getSeconds();
      
      	const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
            		.toString()
            		.padStart(2, "0")}`;
      	const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            		.toString()
            		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      
      	return `${formattedDate} ${formattedTime}`;
}

const PostedGigCard: React.FC<PostedGigCardProps> = ({
      	imageUrl,
      	title,
      	bio,
      	eventStart,
      	eventEnd,
      	tags,
        popupButtonText,
        popupContent,
      	buttonText1,
      	onButtonClick1,
        buttonText2,
      	onButtonClick2,
}) => (
      	<div className="my-gig-cards">
                <img
                        src={imageUrl}
                        alt="Gig"
                />
                <div className="gig-details">
                        <div className="gig-header">{title}</div>
                        <p className="gig-bio">{bio}</p>
                        <p>
                              {formatDateTime(eventStart)} to {formatDateTime(eventEnd)}
                        </p>
                        <div className="gig-bottoms">
                                <div className="gig-tabs">
                                        {/* Dynamically generate spans for each tag */}
                                        {tags?.map((tag, index) => (
                                                <span
                                                        key={index}
                                                        className="tab"
                                                >
                                                        {tag}
                                                </span>
                                        ))}
                                </div>
                                <div className="bottom-buttons">
                                        <Popover>
                                                <PopoverTrigger asChild>
                                                        <button>{popupButtonText}</button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                        {popupContent}
                                                </PopoverContent>
                                        </Popover>
                                        <button onClick={onButtonClick1}>{buttonText1}</button>
                                        <button onClick={onButtonClick2}>{buttonText2}</button>
                                </div>
                        </div>
                </div>
      	</div>
);

export default PostedGigCard;
