import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GigCard from "@/components/GigCards";
import Loading from "@/components/Loading.tsx";
import { fetchGigsData } from "../api/mygigs.api";

const MyGigs = () => {
	const [activeTab, setActiveTab] = useState("APPLIED");
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const { data, isLoading } = useQuery({
		queryKey: ["my_gigs_get"],
		queryFn: () => fetchGigsData(currentUser),
	});

	if (isLoading) return <Loading />;

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
					).map((gig, index) => {
						return (
							<Link to={"/gigs/" + gig.id}>
								<GigCard
									key={index}
									imageUrl={gig.gigProfileImage.public_url}
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
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default MyGigs;
