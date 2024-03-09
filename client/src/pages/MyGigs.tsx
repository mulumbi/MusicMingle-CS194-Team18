import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchGigsData } from "../api/mygigs.api";
import GigCard from "@/components/GigCards";
import { useQuery } from "@tanstack/react-query";

const MyGigs = () => {
	const [activeTab, setActiveTab] = useState("APPLIED");
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const { data, isLoading } = useQuery({
		queryKey: ["my_gigs_get"],
		queryFn: () => fetchGigsData(currentUser),
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="App">
			<div className="page-body">
				<div className="Title">View My Gigs</div>
				<div className="Selection-tabs">
					<button
						className={
							activeTab === "APPLIED"
								? "selection-buttons active"
								: "selection-buttons"
						}
						onClick={() => setActiveTab("APPLIED")}
					>
						APPLIED GIGS
					</button>
					<button
						className={
							activeTab === "POSTED"
								? "selection-buttons active"
								: "selection-buttons"
						}
						onClick={() => setActiveTab("POSTED")}
					>
						POSTED GIGS
					</button>
				</div>
				<div className="my-gigs-cards">
					{(activeTab === "APPLIED"
						? data?.my_applications || []
						: data?.my_gigs || []
					).map((gig, index) => (
						<GigCard
							key={index}
							imageUrl={gig.gigProfileImage}
							title={gig.name}
							bio={gig.bio}
							eventStart={gig.event_start}
							eventEnd={gig.event_end}
							tags={gig.gig_role_tags}
							buttonText={
								activeTab === "APPLIED"
									? "Withdraw Application"
									: "View Applicants"
							}
							onButtonClick={() => {
								/* handle button click */
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default MyGigs;
