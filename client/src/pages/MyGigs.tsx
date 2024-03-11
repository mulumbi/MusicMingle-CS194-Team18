import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import GigCard from "@/components/GigCards";
import PostedGigCard from "@/components/PostedGigCards";
import Loading from "@/components/Loading.tsx";
import { fetchGigsData, mutateCloseGig, mutateWithdrawApp } from "../api/mygigs.api";
import { mutateApplication } from "../api/gigs.api";

const MyGigs = () => {
	const [activeTab, setActiveTab] = useState("APPLIED");
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["my_gigs_get"],
		queryFn: () => fetchGigsData(currentUser),
	});

	const mutateRemove = useMutation({
		mutationFn: (id: any) => mutateApplication(currentUser, id),
		onSuccess: () => refetch(),
	});

	const mutateClose = useMutation({
		mutationFn: (id: any) => mutateCloseGig(currentUser, id),
		onSuccess: () => refetch(),
	});

	const onRemove = (id: any) => {
		  mutateRemove.mutate(id);
	};

	const onClose = (id: any) => {
		mutateClose.mutate(id);
  	};

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
								<Link to={"/gigs/" + app.gigId}>
									<GigCard
										key={index}
										imageUrl={
											app?.gigProfileImage?.public_url ||
											""
										}
										title={app.name}
										bio={app.bio}
										eventStart={app.event_start}
										eventEnd={app.event_end}
										tags={app.gig_role_tags}
										buttonText={
											"View Details"
										}
										onButtonClick={() => {
											// onRemove(app.gigId); // opting to use link and remove directly on the gig page
										}}
									/>
								</Link>
							);
						})
						: (data?.my_gigs).map((gig, index) => (
							<PostedGigCard
								key={index}
								imageUrl={
									gig?.gigProfileImage?.public_url ||
									""
								}
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
										<Link to={"/artists/" + app.user.id}>
											<p>{app.user.name}</p>
										</Link>
								))}
								buttonText1={
									"Edit Gig"
								}
								onButtonClick1={() => {
									/* wire mygigs/edit */
								}}
								buttonText2={
									gig.is_open
									? "Close Gig"
									: "Gig Closed!"
								}
								onButtonClick2={() => {
									onClose(gig.id);
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
