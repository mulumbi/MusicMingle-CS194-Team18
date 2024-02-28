import React from 'react';
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query";
import { mutateProfileDetails } from "../api/profile.api";
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RxCross2 } from "react-icons/rx";
import './EditProfile.css';

const formSchema = z.object({
	bio: z.string(),
})

function EditProfile() {
	const { currentUser } = useContext(AuthContext);
	const [open, setOpen] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		  	bio: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log("Submitting this form!");
		console.log(values);
		setOpen(false);
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button className="edit-button" type="button">Edit Profile</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="dialog-overlay" />
				<Dialog.Content className="dialog-content">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<Dialog.Title className="dialog-title">Edit profile</Dialog.Title>
							<Dialog.Description className="dialog-description">
								Make changes to your profile here!
							</Dialog.Description>
							<FormField
								control={form.control}
								name="bio"
								className="fieldset"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="label">About Me</FormLabel>
										<FormControl>
											<Input className="input" placeholder="shadcn" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="save-row">
								<Button className="save-button" type="submit">Save changes</Button>
							</div>
							<Dialog.Close asChild>
								<button className="icon-button" type="button" aria-label="Close">
									<RxCross2/>
								</button>
							</Dialog.Close>
						</form>
					</Form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default EditProfile;