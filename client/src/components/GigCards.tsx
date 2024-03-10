import React from "react";
import "./GigCard.css";

interface GigCardProps {
	title: string;
	bio: string;
	eventStart?: string; // Changed to string to match the expected type from API
	eventEnd?: string; // Changed to string to match the expected type from API
	tags: string[];
	buttonText: string;
	onButtonClick: () => void;
}

const GigCard: React.FC<GigCardProps> = ({
	imageUrl,
	title,
	bio,
	eventStart,
	eventEnd,
	tags,
	buttonText,
	onButtonClick,
}) => {
	// Parse date and times
	const startDateTime = new Date(eventStart);
	const startDate = startDateTime.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		weekday: "short",
	});
	const startTime = startDateTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const endDateTime = new Date(eventEnd);
	const endDate = endDateTime.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		weekday: "short",
	});
	const endTime = endDateTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="my-gig-cards">
			<img
				src={imageUrl}
				alt="Main Image"
			/>
			<div className="gig-details">
				<div>
					<div className="gig-title">{title}</div>
					{eventStart && (
						<div className="date-time-row">
							<div className="date">{startDate}</div>
							{startTime + " - "}
							{endDate != startDate && (
								<div className="date">{endDate}</div>
							)}
							{endTime}
						</div>
					)}
					<p className="gig-bio">{bio}</p>
				</div>

				<div className="gig-footer">
					<div className="gig-tags">
						{/* Dynamically generate spans for each tag */}
						{tags?.map((tag, index) => (
							<span
								key={index}
								className="tag"
							>
								{tag}
							</span>
						))}
					</div>
					<button
						className="gig-footer-button"
						onClick={onButtonClick}
					>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default GigCard;
