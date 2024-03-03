import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
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
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"  
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IoChevronBackSharp } from "react-icons/io5";
import { Check, ChevronsUpDown } from "lucide-react"

const FormSchema = z.object({
	// profile_image: z.string(),
	bio: z.string(),
	user_role_tags: z.string(),
	user_genre_tags: z.string(),
	estimate_flat_rate: z.coerce.number(),
	// portfolio_images: z.array(z.string()),
	// deleted_portfolio_images: z.array(z.string()),
	// videos: z.array(z.object({url: z.string(), title: z.string()})),
	// deleted_videos: z.array(z.object({url: z.string(), title: z.string()})),
})

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
] as const

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
] as const

export function ProfileSettings() {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log("onSubmit called from ProfileSettings");
		console.log(JSON.stringify(data, null, 2));
		navigate("/profile", {state: data});
	}

	return (
		<div className="profile-settings-page">
			<div className="form-container">
				<Button className="back-button" onClick={() => navigate("/profile")}>
					<IoChevronBackSharp />
				</Button> 
				<h1>Edit profile</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
							<FormItem>
								<FormLabel className="settings-label">About Me</FormLabel>
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
							control={form.control}
							name="user_role_tags"
							render={({ field }) => (
							<FormItem>
								<FormLabel className="settings-label">Roles</FormLabel>
								<div>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button variant="outline" role="combobox" className="settings-combobox">
													{field.value
														? roles.find(
															(role) => role.value === field.value
														)?.label
														: "Select role"
													}
													<ChevronsUpDown className="chevrons-icon"/>
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="popover-content">
											<Command>
												<CommandGroup>
													{roles.map((role) => (
														<CommandItem
															value={role.label}
															key={role.value}
															className="command-item"
															onSelect={() => {
																form.setValue("user_role_tags", role.value)
															}}
														>
															<Check className={role.value === field.value ? "check-show" : "check-hide"} />
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
							control={form.control}
							name="user_genre_tags"
							render={({ field }) => (
							<FormItem>
								<FormLabel className="settings-label">Genres</FormLabel>
								<div>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button variant="outline" role="combobox" className="settings-combobox">
													{field.value
														? genres.find(
															(genre) => genre.value === field.value
														)?.label
														: "Select genre"
													}
													<ChevronsUpDown className="chevrons-icon"/>
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="popover-content">
											<Command>
												<CommandGroup>
													{genres.map((genre) => (
														<CommandItem
															value={genre.label}
															key={genre.value}
															className="command-item"
															onSelect={() => {
																form.setValue("user_genre_tags", genre.value)
															}}
														>
															<Check className={genre.value === field.value ? "check-show" : "check-hide"} />
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
							control={form.control}
							name="estimate_flat_rate"
							render={({ field }) => (
							<FormItem>
								<FormLabel className="settings-label">Typical Rate (per Gig)</FormLabel>
								<FormControl>
									<Input type="number" placeholder="$" className="settings-input" {...field} />
								</FormControl>
								<FormMessage className="settings-message" />
							</FormItem>
							)}
						/>
						<div className="settings-actions">
							<Button className="cancel-button" onClick={() => navigate("/profile")}>Cancel</Button>
							<Button className="submit-button" type="submit">Submit</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}

export default ProfileSettings;