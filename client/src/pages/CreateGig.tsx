import React, { useState, useContext } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { FaCalendar } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import { ChevronsUpDown, Check } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { mutateCreateGig } from "@/api/create_gig.api";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { addDays, format, isAfter } from "date-fns";
import { useNavigate } from "react-router-dom";
import Loading  from "@/components/Loading";

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

function CreateGig() {
	const [date, setDate] = useState<DateRange | undefined>({
		from: new Date(),
		to: addDays(new Date(), 1),
	});
	const [gigTitle, setGigTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startTime, setStartTime] = useState(""); // State for start time
	const [endTime, setEndTime] = useState(""); // State for end time
	const [budget, setBudget] = useState("");
	const [genre, setGenre] = useState([]);
	const [instrumentRole, setInstrumentRole] = useState([]);
	const [portfolioImages, setGigPortfolioImages] = useState<FileList | null>(
		null
	);
	const [profileImage, setGigProfileImages] = useState<File | null>(null);
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false); // State to control the display of the Loading component
	const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State to control the display of the success popup


	const { mutate } = useMutation({
		mutationFn: (bodyFormData: any) =>
			mutateCreateGig(currentUser, bodyFormData),
		onSuccess: (data) => {
			navigate("/gigs/" + data.id);
		},
	});


	const onSubmit = () => {
		setIsLoading(true);
		console.log("onSubmit");
		console.log(
			gigTitle,
			description,
			date,
			startTime,
			endTime,
			budget,
			genre,
			profileImage
		);

		if (
			!date?.from ||
			!date?.to ||
			date.from > date?.to ||
			!startTime ||
			!endTime
		) {
			console.log("Invalid date or time");
			return;
		}

		if (!profileImage) {
			console.log("Profile image is required");
			return;
		}

		if (!budget || isNaN(parseInt(budget))) {
			console.log("Budget is not valid");
			return;
		}

		// Check to make sure start date < end date
		const startDate = date?.from;
		const [startHour, startMinute] = startTime.split(":");
		startDate?.setHours(parseInt(startHour));
		startDate?.setMinutes(parseInt(startMinute));
		startDate?.setSeconds(0);
		const endDate = date?.to;
		const [endHour, endMinute] = endTime.split(":");
		endDate?.setHours(parseInt(endHour));
		endDate?.setMinutes(parseInt(endMinute));
		endDate?.setSeconds(0);

		if (isAfter(startDate, endDate)) {
			console.log("Start date is before end date");
			return;
		}

		// Call this function to get the values from the form and send them to the server
		const bodyFormData = new FormData();
		bodyFormData.append("name", gigTitle); // Budget already a string
		bodyFormData.append("bio", description); // Budget already a string
		bodyFormData.append("event_start", startDate.toISOString());
		bodyFormData.append("event_end", endDate.toISOString());
		if (parseInt(budget)) {
			bodyFormData.append("estimate_flat_rate", budget); // Budget already a string
		}
		if (genre.length > 0) {
			bodyFormData.append("gig_role_tags", JSON.stringify(genre)); // Convert the array to a string as we need to pass as ["Musician", "Singer]
		}
		if (instrumentRole.length > 0) {
			bodyFormData.append(
				"gig_genre_tags",
				JSON.stringify(instrumentRole)
			); // Convert the array to a string as we need to pass as ["Musician", "Singer]
		}
		bodyFormData.append("gig_profile_image", profileImage);
		if (portfolioImages && portfolioImages.length > 0) {
			for (const file of Array.from(portfolioImages)) {
				bodyFormData.append("gig_images", file);
			}
		}
		for (const pair of bodyFormData.entries()) {
			console.log(pair[0] + ", " + pair[1]);
		}
		mutate(bodyFormData), {
			onSuccess: (data) => {
				setIsLoading(false); // Hide loading indicator
				setShowSuccessPopup(true); // Show success popup
				// navigate("/gig?gig_id=" + data.id); // Navigate to the gig page
			},
			onError: () => {
				setIsLoading(false); // Hide loading indicator on error
				// Optionally show an error message to the user
			}
		};
	};





	return (
		<div
			className="App"
			id="CreateGigPage"
		>
			{isLoading && <Loading />}
			<div className="create_gig">
				<h2 className="NewGigTitle">Create New Gig</h2>
				<div className="new-gig-fields">
					<Label className="entryLabel">Gig Title: </Label>
					<Input
						type="text"
						onChange={(e) => setGigTitle(e.target.value)}
						required
					/>

					<Label className="entryLabel">Gig Profile Image: </Label>
					<Input
						id="gig_profile_image"
						type="file"
						onChange={(e) => {
							if (e?.target?.files?.length > 0) {
								setGigProfileImages(e.target.files[0]);
							}
						}}
						required
					/>

					<Label className="entryLabel">Gig Gallery Images:</Label>
					<Input
						id="gig_portfolio_images"
						type="file"
						multiple
						onChange={(e) => {
							if (e?.target?.files?.length > 0) {
								setGigPortfolioImages(e.target.files);
							}
						}}
					/>

					<Label className="entryLabel">Description:</Label>
					<Textarea
						style={{ width: "100%", height: "150px" }}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<Label className="entryLabel">Date and Time:</Label>
					<div className="datetime-picker">
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline">
									<FaCalendar className="calendar-icon" />
									{date?.from ? (
										date.to ? (
											<>
												{format(date.from, "LLL dd, y")}{" "}
												- {format(date.to, "LLL dd, y")}
											</>
										) : (
											format(date.from, "LLL dd, y")
										)
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="select-date">
								<Calendar
									initialFocus
									mode="range"
									defaultMonth={date?.from}
									selected={date}
									onSelect={setDate}
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover>
					</div>
					<Label className="entryLabel">
						Start Time:
						<Input
							type="time"
							onChange={(e) => setStartTime(e.target.value)}
							style={{ marginLeft: "10px" }}
						/>
					</Label>
					<Label className="entryLabel">
						End Time:
						<Input
							type="time"
							onChange={(e) => setEndTime(e.target.value)}
							style={{ marginLeft: "10px" }}
						/>
					</Label>
					<Label className="entryLabel">
						Budget:
						<Input
							type="text"
							placeholder="50"
							onChange={(e) => setBudget(e.target.value)}
						/>
					</Label>
					<Label className="entryLabel">Genre: </Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								className="settings-combobox"
							>
								{genre.length
									? genre.length + " selected"
									: "Select genres"}
								<ChevronsUpDown className="chevrons-icon" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="popover-content">
							<Command>
								<CommandGroup>
									{genres.map((individual_genre) => (
										<CommandItem
											value={individual_genre.label}
											key={individual_genre.value}
											className="command-item"
											onSelect={() => {
												const existing_tags =
													genre || [];
												if (
													!existing_tags.includes(
														individual_genre.value
													)
												) {
													const new_tags =
														existing_tags.concat([
															individual_genre.value,
														]);
													setGenre(new_tags);
												} else {
													const new_tags =
														existing_tags.filter(
															(tag) =>
																tag !=
																individual_genre.value
														);
													setGenre(new_tags);
												}
											}}
										>
											<Check
												className={
													genre?.includes(
														individual_genre.value
													)
														? "check-show"
														: "check-hide"
												}
											/>
											{individual_genre.label}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>

					<Label className="entryLabel">Instrument/Role:</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								className="settings-combobox"
							>
								{instrumentRole.length
									? instrumentRole.length + " selected"
									: "Select roles"}
								<ChevronsUpDown className="chevrons-icon" />
							</Button>
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
												const existing_tags =
													instrumentRole || [];
												if (
													!existing_tags.includes(
														role.value
													)
												) {
													const new_tags =
														existing_tags.concat([
															role.value,
														]);
													setInstrumentRole(new_tags);
												} else {
													const new_tags =
														existing_tags.filter(
															(tag) =>
																tag !=
																role.value
														);
													setInstrumentRole(new_tags);
												}
											}}
										>
											<Check
												className={
													instrumentRole?.includes(
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

					<div className="button_container">
						<Button onClick={onSubmit} id="create_gig_button">
							Create Gig
						</Button>
					</div>
				</div>
				{showSuccessPopup && (
					<div>
						<p>Gig created successfully!</p>
						<button onClick={() => navigate("/gigs")}>Go to Gigs Page</button>
						<button onClick={() => navigate("/my-gigs")}>Go to My Gigs</button>
					</div>
				)}
			</div>

		</div>
	);
}

export default CreateGig;
