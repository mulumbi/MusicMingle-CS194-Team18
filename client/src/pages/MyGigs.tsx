import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GigCard from "@/components/GigCards";
import PostedGigCard from "@/components/PostedGigCards";
import Loading from "@/components/Loading.tsx";
import { fetchGigsData, mutateCloseGig, mutateWithdrawApp } from "../api/mygigs.api";

const MyGigs = () => {
	const [activeTab, setActiveTab] = useState("APPLIED");
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["my_gigs_get"],
		queryFn: () => fetchGigsData(currentUser),
	});

	useEffect(() => {
		refetch();
	}, []);

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
					  	? (data?.my_applications).map((app, index) => {
							return (
								<Link to={"/gigs/" + app.gig.id}>
									<GigCard
										key={index}
										imageUrl={app.gig.gigProfileImage}
										title={app.gig.name}
										bio={app.gig.bio}
										eventStart={app.gig.event_start}
										eventEnd={app.gig.event_end}
										tags={app.gig.gig_role_tags}
										buttonText={
											"Withdraw Application"
										}
										onButtonClick={() => {
											mutateWithdrawApp(currentUser, app.gig.id);
										}}
									/>
								</Link>
							);
						})
						: (data?.my_gigs).map((gig, index) => (
							<PostedGigCard
								key={index}
								imageUrl={gig.gigProfileImage}
								title={gig.name}
								bio={gig.bio}
								eventStart={gig.event_start}
								eventEnd={gig.event_end}
								tags={gig.gig_role_tags}
								popupButtonText={
									"View Applicants"
								}
								popupContent={
									(gig.applications).map((app) => (
										<Link to="/artists/${app.user.id}">
											<p>{app.user.name}</p>
										</Link>
								))}
								buttonText1={
									"Edit Gig"
								}
								onButtonClick1={() => {
									/* TODO: wire mygigs/edit */
								}}
								buttonText2={
									"Close Gig"
								}
								onButtonClick2={() => {
									mutateCloseGig(currentUser, gig.id);
								}}
							/>
						))
					  )}
				</div>
			</div>
		</div>
	);
};

export default MyGigs;
