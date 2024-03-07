import { useContext, useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { IoChevronBackSharp } from "react-icons/io5";
import { Check, ChevronsUpDown } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { fetchProfileDetails, mutateProfileDetails } from "../api/profile.api";

const FormSchema = z.object({
	profile_image: z.instanceof(File).optional(),
	bio: z.string().optional(),
	user_role_tags: z.array(z.string()).optional(),
	user_genre_tags: z.array(z.string()).optional(),
	estimate_flat_rate: z.coerce.number().optional(),
	is_artist: z.boolean().optional(),
	portfolio_images: z.array(z.instanceof(File)).optional(),
	// deleted_portfolio_images: z.array(z.string()),
	videos: z.array(z.instanceof(File)).optional(),
	// deleted_videos: z.array(z.object({url: z.string(), title: z.string()})),
});

const genres = [
	{ label: "Pop", value: "Pop" },
	{ label: "Rock", value: "Rock" },
	{ label: "R&B", value: "R&B" },
	{ label: "Hip Hop", value: "Hip Hop" },
	{ label: "Electronic", value: "Electronic" },
	{ label: "Jazz", value: "Jazz" },
	{ label: "Country", value: "Country" },
	{ label: "Metal", value: "Metal" },
	{ label: "Classical", value: "Classical" },
	{ label: "Indie", value: "Indie" },
	{ label: "Latin", value: "Latin" },
	{ label: "Cultural", value: "Cultural" },
] as const;

const roles = [
	{ label: "Gig Organizer", value: "Gig Organizer" },
	{ label: "Vocalist", value: "Vocalist" },
	{ label: "Instrumentalist", value: "Instrumentalist" },
	{ label: "Guitar", value: "Guitar" },
	{ label: "Bass", value: "Bass" },
	{ label: "Piano", value: "Piano" },
	{ label: "Drums", value: "Drums" },
	{ label: "Percussion", value: "Percussion" },
	{ label: "Strings", value: "Strings" },
	{ label: "Woodwinds", value: "Woodwinds" },
	{ label: "Brass", value: "Brass" },
	{ label: "Songwriter", value: "Songwriter" },
	{ label: "Composer", value: "Composer" },
	{ label: "Producer", value: "Producer" },
	{ label: "Audio Engineer", value: "Audio Engineer" },
	{ label: "Live Sound Technician", value: "Live Sound Technician" },
	{ label: "Recording Artist", value: "Recording Artist" },
] as const;

export function ProfileSettings() {
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["profile_get_to_settings"],
		queryFn: () => fetchProfileDetails(currentUser),
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, []);

	const { control, setValue, reset, handleSubmit, ...form } = useForm<
		z.infer<typeof FormSchema>
	>({
		resolver: zodResolver(FormSchema),
		defaultValues: useMemo(() => {
			return {
				bio: data?.bio ? data.bio : "",
				user_role_tags: data?.user_role_tags ? data.user_role_tags : [],
				user_genre_tags: data?.user_genre_tags
					? data.user_genre_tags
					: [],
				estimate_flat_rate: data?.estimate_flat_rate
					? data.estimate_flat_rate
					: undefined,
				is_artist: data?.is_artist,
			};
		}, [data]),
	});

	useEffect(() => {
		reset(data);
	}, [data]);

	const { mutate, error } = useMutation({
		mutationFn: (bodyFormData: any) =>
			mutateProfileDetails(currentUser, bodyFormData),
		onSuccess: () => navigate("/profile", { state: { refresh: true } }),
	});

	function onSubmit(formData: z.infer<typeof FormSchema>) {
		let bodyFormData = new FormData();

		if (formData.profile_image)
			console.log("formData.profile_image", formData.profile_image);
		bodyFormData.append("profile_image", formData.profile_image);
		bodyFormData.append("bio", formData.bio ? formData.bio : "");
		if (formData.user_role_tags)
			bodyFormData.append(
				"user_role_tags",
				JSON.stringify(formData.user_role_tags)
			);
		if (formData.user_genre_tags)
			bodyFormData.append(
				"user_genre_tags",
				JSON.stringify(formData.user_genre_tags)
			);
		if (typeof formData.estimate_flat_rate === "number")
			bodyFormData.append(
				"estimate_flat_rate",
				JSON.stringify(formData.estimate_flat_rate)
			);
		if (typeof formData.is_artist === "boolean")
			bodyFormData.append("is_artist", String(formData.is_artist));

		mutate(bodyFormData);
	}

	if (isLoading) return <div>Loading...</div>;
	console.log(data);
	return (
		<div className="profile-settings-page">
			<div className="form-container">
				<Button
					className="back-button"
					onClick={() => navigate("/profile")}
				>
					<IoChevronBackSharp />
				</Button>
				<h1>Edit profile</h1>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormField
							control={control}
							name="profile_image"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="settings-label">
										Profile Photo
									</FormLabel>
									<div className="settings-image">
										<FormControl>
											<Input
												type="file"
												accept="image/*"
												onChange={(e) => {
													if (
														e?.target?.files?.length
													) {
														setValue(
															"profile_image",
															e.target.files[0]
														);
													}
												}}
											/>
										</FormControl>
									</div>
									<FormMessage className="settings-message" />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="settings-label">
										About Me
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Tell us about yourself!"
											className="settings-textarea"
											{...field}
										/>
									</FormControl>
									<FormMessage className="settings-message" />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="user_role_tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="settings-label">
										Roles
									</FormLabel>
									<div>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className="settings-combobox"
													>
														{field.value &&
														field.value.length
															? field.value
																	.length +
															  " selected"
															: "Select role"}
														<ChevronsUpDown className="chevrons-icon" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="popover-content">
												<Command>
													<CommandGroup>
														{roles.map((role) => (
															<CommandItem
																value={
																	role.label
																}
																key={role.value}
																className="command-item"
																onSelect={() => {
																	const existing_tags =
																		field.value ||
																		[];
																	if (
																		!existing_tags.includes(
																			role.value
																		)
																	) {
																		const new_tags =
																			existing_tags.concat(
																				[
																					role.value,
																				]
																			);
																		setValue(
																			"user_role_tags",
																			new_tags
																		);
																	} else {
																		const new_tags =
																			existing_tags.filter(
																				(
																					tag
																				) =>
																					tag !=
																					role.value
																			);
																		setValue(
																			"user_role_tags",
																			new_tags
																		);
																	}
																}}
															>
																<Check
																	className={
																		field.value?.includes(
																			role.value
																		)
																			? "check-show"
																			: "check-hide"
																	}
																/>
																{role.label}
															</CommandItem>
														))}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
									</div>
									<FormMessage className="settings-message" />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="user_genre_tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="settings-label">
										Genres
									</FormLabel>
									<div>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className="settings-combobox"
													>
														{field.value &&
														field.value.length
															? field.value
																	.length +
															  " selected"
															: "Select genre"}
														<ChevronsUpDown className="chevrons-icon" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="popover-content">
												<Command>
													<CommandGroup>
														{genres.map((genre) => (
															<CommandItem
																value={
																	genre.label
																}
																key={
																	genre.value
																}
																className="command-item"
																onSelect={() => {
																	const existing_tags =
																		field.value ||
																		[];
																	if (
																		!existing_tags.includes(
																			genre.value
																		)
																	) {
																		const new_tags =
																			existing_tags.concat(
																				[
																					genre.value,
																				]
																			);
																		setValue(
																			"user_genre_tags",
																			new_tags
																		);
																	} else {
																		const new_tags =
																			existing_tags.filter(
																				(
																					tag
																				) =>
																					tag !=
																					genre.value
																			);
																		setValue(
																			"user_genre_tags",
																			new_tags
																		);
																	}
																}}
															>
																<Check
																	className={
																		field.value?.includes(
																			genre.value
																		)
																			? "check-show"
																			: "check-hide"
																	}
																/>
																{genre.label}
															</CommandItem>
														))}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
									</div>
									<FormMessage className="settings-message" />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="estimate_flat_rate"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="settings-label">
										Typical Rate (per Gig)
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="$"
											className="settings-input"
											{...field}
										/>
									</FormControl>
									<FormMessage className="settings-message" />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="is_artist"
							render={({ field }) => (
								<FormItem>
									<div className="settings-switch-container">
										<div>
											<FormLabel className="settings-label">
												Artist Profile
											</FormLabel>
											<FormDescription className="settings-description">
												Publicly list and display your
												profile on the Artists page.
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</div>
								</FormItem>
							)}
						/>
						<div className="settings-actions">
							<Button
								className="cancel-button"
								onClick={() =>
									navigate("/profile", {
										state: { refresh: true },
									})
								}
							>
								Cancel
							</Button>
							<Button
								className="submit-button"
								type="submit"
							>
								Submit
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

export default ProfileSettings;
