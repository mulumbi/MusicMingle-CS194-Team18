import React, { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from "../context/AuthContext";
import { fetchProfileDetails, mutateProfileDetails } from "../api/profile.api";

type PortfolioItemProps = {
  image?: { public_url: string, id: string };
  video?: { public_url: string, id: string };
  setHasDeletedMedia?: Dispatch<SetStateAction<boolean>>;
  viewOnly?: boolean;
};

const PortfolioItem: React.FC<PortfolioItemProps> = (props) => {
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["profile_get"],
		queryFn: () => fetchProfileDetails(currentUser),
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, []);

	const { mutate } = useMutation({
		mutationFn: (bodyFormData: any) =>
			mutateProfileDetails(currentUser, bodyFormData),
		onSuccess: () => props.setHasDeletedMedia(true),
	});

	function handleDelete() {
		console.log(currentUser);
		let bodyFormData = new FormData();
		if (props.image)
			bodyFormData.append("deleted_portfolio_images", JSON.stringify([props.image.id]));
		if (props.video)
			bodyFormData.append("deleted_videos", JSON.stringify([props.video.id]));

		mutate(bodyFormData);
	}

	return (
		<div className="portfolio-item">
			{ props.image && 
				<img src={props.image.public_url} />
			}
			{ props.video && 
				<video width="400" preload="metadata" controls={true}>
					<source src={props.video.public_url} type="video/mp4" />
				</video>
			}
			{ !props.viewOnly && (
				<AlertDialog>
					<AlertDialogTrigger className="portfolio-delete-button">
						<RxCross2/>
					</AlertDialogTrigger>
					<AlertDialogPortal>
						<AlertDialogOverlay className="dialog-overlay" />
						<AlertDialogContent className="dialog-content">
							<AlertDialogHeader>
								<AlertDialogTitle className="dialog-title">Remove from portfolio?</AlertDialogTitle>
								<AlertDialogDescription className="dialog-description">
									This will delete your file from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<div className="dialog-footer">
									<AlertDialogCancel className="dialog-cancel">Cancel</AlertDialogCancel>
									<AlertDialogAction className="dialog-submit" onClick={handleDelete}>
										Remove
									</AlertDialogAction>
								</div>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogPortal>
				</AlertDialog>
			)}
		</div>
	  );
}

export default PortfolioItem;
