import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchGigsData } from "../api/mygigs.api";
import GigCard from "@/components/GigCards";
import { useQuery } from "@tanstack/react-query";

const MyGigs = () => {
	// const [gigData, setGigData] = useState({
	// 	my_gigs: [],
	// 	my_applications: [],
	// });
	const [activeTab, setActiveTab] = useState("APPLIED");
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	// useEffect(() => {
	//   const fetchData = async () => {
	//     if (currentUser) {
	//       // Fetch profile details first
	//       const userProfile = await fetchProfileDetails(currentUser);
	//       if (userProfile) {
	//         const gigsData = await fetchGigsData(currentUser);
	//         if (gigsData) {
	//           setGigData(gigsData);
	//         }
	//       } else {
	//         console.error("Failed to fetch user profile.");

	//       }
	//     }
	//   };
	//   fetchData();
	// }, [currentUser, navigate]);

	const { data, error, isLoading } = useQuery({
		queryKey: ["my_gigs_get"],
		queryFn: () => fetchGigsData(currentUser),
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}
	console.log(isLoading, data);
	return (
		<div>
			<div>
				<button
					className={activeTab === "APPLIED" ? "active" : ""}
					onClick={() => setActiveTab("APPLIED")}
				>
					APPLIED GIGS
				</button>
				<button
					className={activeTab === "POSTED" ? "active" : ""}
					onClick={() => setActiveTab("POSTED")}
				>
					POSTED GIGS
				</button>
			</div>
			<div className="my-gigs-cards">
				{(activeTab === "APPLIED"
					? data?.my_applications
					: data?.my_gigs
				).map((gig, index) => (
					<GigCard
						key={index}
						id={gig.id}
						estimateFlatRate={gig.estimate_flat_rate}
						name={gig.name}
						bio={gig.bio}
						eventStart={gig.event_start}
						eventEnd={gig.event_end}
						gigRoleTags={gig.gig_role_tags}
					/>
				))}
			</div>
		</div>
	);
};

export default MyGigs;
