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
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mutateCreateGig } from "@/api/create_gig.api";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { addDays, endOfToday, format } from "date-fns";
import { cn } from "@/lib/utils";
import { start } from "repl";

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
	console.log(date, "startDate");
	const mutation = useMutation({
		mutationFn: (bodyFormData: any) =>
			mutateCreateGig(currentUser, bodyFormData),
	});
	console.log(date, "date");
	const onSubmit = () => {
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

		if (
			!startDate ||
			!endDate ||
			startDate > endDate ||
			!startTime ||
			!endTime
		) {
			console.log("Invalid date range or start/end time");
			return;
		}

		if (!profileImage) {
			console.log("Profile image is required");
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
		mutation.mutate(bodyFormData);
	};

	return (
		<div>
			<div>
				<div>Create New Gig</div>
				<div>
					<div>
						<Label>
							Gig Title:
							<Input
								type="text"
								value={gigTitle}
								onChange={(e) => setGigTitle(e.target.value)}
								required
							/>
						</Label>

						<Label>
							Gig Profile Image:
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
						</Label>

						<Label>
							Gig Gallery Images:
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
						</Label>

						<Label>
							Description:
							<Textarea
								style={{ width: "100%", height: "150px" }}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</Label>

						<Label>
							Date and Time:
							<div>
								<div className="grid gap-2">
									<Popover className="z-50">
										<PopoverTrigger asChild>
											<Button
												id="date"
												variant={"outline"}
												className={cn(
													"w-[300px] justify-start text-left font-normal",
													!date &&
														"text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date?.from ? (
													date.to ? (
														<>
															{format(
																date.from,
																"LLL dd, y"
															)}{" "}
															-{" "}
															{format(
																date.to,
																"LLL dd, y"
															)}
														</>
													) : (
														format(
															date.from,
															"LLL dd, y"
														)
													)
												) : (
													<span>Pick a date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start"
										>
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
								Start Time:
								<Input
									type="time"
									onChange={(e) =>
										setStartTime(e.target.value)
									}
									style={{ marginLeft: "10px" }}
								/>
								End Time:
								<Input
									type="time"
									onChange={(e) => setEndTime(e.target.value)}
									style={{ marginLeft: "10px" }}
								/>
							</div>
						</Label>

						<Label>
							Budget:
							<Input
								type="number"
								onChange={(e) => setBudget(e.target.value)}
							/>
						</Label>
						{/* Replace this with a drop down of genre tags */}
						<Label>
							Genre:
							<Input
								type="text"
								value={genre}
								onChange={(e) => setGenre(e.target.value)}
							/>
						</Label>
						{/* Replace this with a drop down of role tags */}
						<Label>
							Instrument/Role:
							<Input
								type="text"
								value={instrumentRole}
								onChange={(e) =>
									setInstrumentRole(e.target.value)
								}
							/>
						</Label>

						<Button onClick={() => onSubmit()}>Create Gig</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreateGig;
