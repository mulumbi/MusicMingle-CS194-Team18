import React, { useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form"
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RxCross2 } from "react-icons/rx";
import './SharePage.css';

type SharePageProps = {
    id?: string;
	category?: string;
};
 
const defaultProps: SharePageProps = {
	category: 'artists',
}

const SharePage: React.FC<SharePageProps> = (props) => {
	const [open, setOpen] = React.useState(false);
	const [isCopied, setIsCopied] = React.useState(false);
	const shareUrl = "https://musicmingle-cabf2.web.app/" + props.category + "/" + props?.id;

	useEffect(() => {
		setIsCopied(false);
	}, [open]);

	console.log("props.category", props.category);
	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button className="share-button" type="button">Share</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="dialog-overlay" />
				<Dialog.Content className="dialog-content">
							<Dialog.Title className="dialog-title">
								Share {props.category == "artists" ? "profile" : "gig"}
							</Dialog.Title>
							<Dialog.Description>
								<div className="dialog-description">
									<Input disabled className="input" placeholder={shareUrl} />
									<Button
										className="copy-button"
										onClick={() => {
											navigator.clipboard.writeText(shareUrl);
											setIsCopied(true);
										}}
									>
										Copy
									</Button>
								</div>
								<div className="dialog-message">
									<p><i>{isCopied ? "Link copied to clipboard!" : ""}</i></p>
								</div>
							</Dialog.Description>
							<Dialog.Close asChild>
								<button className="icon-button" type="button" aria-label="Close">
									<RxCross2/>
								</button>
							</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

SharePage.defaultProps = defaultProps;

export default SharePage;