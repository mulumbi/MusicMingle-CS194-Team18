import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { GrFilter } from "react-icons/gr";
import { cn } from "@/lib/utils";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { CustomSlider } from "@/components/CustomSlider";
import * as Slider from "@radix-ui/react-slider";
import { useState, useEffect } from "react";

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


interface FilterSidebarGigProps {
	minBudget: number; // Define the expected type for minBudget
	maxBudget: number; // Define the expected type for maxBudget
	selectedGenres: string; // Define the expected type for selectedGenres
	selectedRoles: string; // Define the expected type for selectedRoles
	onApplyFilters: (minBudget: number, maxBudget: number, selectedGenres: string, selectedRoles: string) => void; 
}

const FilterSidebarGig: React.FC<FilterSidebarGigProps> = ({
	minBudget,
	maxBudget,
	selectedGenres,
    selectedRoles,
	onApplyFilters,
}) => {
	const [localMinBudget, setLocalMinBudget] = React.useState(minBudget);
	const [localMaxBudget, setLocalMaxBudget] = React.useState(maxBudget);
	const [localSelectedGenres, setLocalSelectedGenres] = React.useState(selectedGenres);
    const [localSelectedRoles, setLocalSelectedRoles] = React.useState(selectedRoles);


	const handleApplyFilters = () => {
        onApplyFilters(localMinBudget, localMaxBudget, localSelectedGenres, localSelectedRoles);
    };

	return (
		<Card id="Filterbar">
			<CardHeader className="filterbar-header">
				<CardTitle>Filters</CardTitle>
			</CardHeader>

			<CardContent>
				<div>
					<div className="filter-action">
						<h5>Min Budget</h5>
						<Input
							type="number"
							placeholder="Enter min $$$"
							onChange={(e) =>
								setLocalMinBudget(Number(e.target.value))
							}
						/>
					</div>

					<div className="filter-action">
						<h5>Max Budget</h5>
						<Input
							type="number"
							placeholder="Enter max SSS"
							onChange={(e) =>
								setLocalMaxBudget(Number(e.target.value))
							}
						/>
					</div>

					<div className="filter-action">
						<h5>Genre</h5>
						<Select onChange={(e) => setLocalSelectedGenres(e.target.value)}>
							<SelectTrigger >
								<SelectValue placeholder="Choose genre" />
							</SelectTrigger >
							<SelectContent className="fillDropdown" >
								{genres.map(genre => (
									<SelectItem key={genre.value} value={genre.value} >{genre.label}</SelectItem>
								))}
							</SelectContent >
						</Select>
					</div>

					<div className="filter-action">
						<h5>Role</h5>
						<Select onChange={(e) => setLocalSelectedRoles(e.target.value)}>
							<SelectTrigger>
								<SelectValue placeholder="Choose role" />
							</SelectTrigger>
							<SelectContent className="fillDropdown">
								{roles.map(role => (
									<SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
									
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					className="apply-button"
					onClick={handleApplyFilters}
				>
					Apply{" "}
				</Button>
			</CardFooter>
		</Card>
	);
};

interface FilterSidebarArtistProps {
	minRate: number;
	maxRate: number;
	onApplyFilters: (minRate: number, maxRate: number) => void;
}

const FilterSidebarArtist: React.FC<FilterSidebarArtistProps> = ({
	minRate,
	maxRate,
	onApplyFilters,
}) => {
	const [localMinRate, setLocalMinRate] = useState(minRate);
	const [localMaxRate, setLocalMaxRate] = useState(maxRate);

	const handleApplyFilters = () => {
		onApplyFilters(localMinRate, localMaxRate);
	};

	return (
		<Card id="Filterbar">
			<CardHeader className="filterbar-header">
				<CardTitle>Filters</CardTitle>
			</CardHeader>

			<CardContent>
				<div>
					<div className="filter-action">
						<h5>Flat Rate Min</h5>
						<Input
							type="number"
							placeholder="Enter min $$$"
							onChange={(e) =>
								setLocalMinRate(Number(e.target.value))
							}
						/>
					</div>

					<div className="filter-action">
						<h5>Flat Rate Max</h5>
						<Input
							type="number"
							placeholder="Enter max $$$"
							onChange={(e) =>
								setLocalMaxRate(Number(e.target.value))
							}
						/>
					</div>

					<div className="filter-action">
						<h5>Genre</h5>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Choose genre" />
							</SelectTrigger>
							<SelectContent className="fillDropdown">
								{genres.map(genre => (
									<SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="filter-action">
						<h5>Role</h5>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Choose role" />
							</SelectTrigger>
							<SelectContent className="fillDropdown">
								{roles.map(role => (
									<SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>

			<CardFooter>
				<Button
					className="apply-button"
					onClick={handleApplyFilters}
				>
					Apply <GrFilter />{" "}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default FilterSidebarGig;

export { FilterSidebarArtist };
