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

interface FilterSidebarGigProps {
	minBudget: number; // Define the expected type for minBudget
	maxBudget: number; // Define the expected type for maxBudget
	onApplyFilters: (minBudget: number, maxBudget: number) => void;
}

const FilterSidebarGig: React.FC<FilterSidebarGigProps> = ({
	minBudget,
	maxBudget,
	onApplyFilters,
}) => {
	const [localMinBudget, setLocalMinBudget] = React.useState(minBudget);
	const [localMaxBudget, setLocalMaxBudget] = React.useState(maxBudget);

	const handleApplyFilters = () => {
		onApplyFilters(localMinBudget, localMaxBudget);
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

					{/* <div className="filter-action">
            <CustomSlider label="Budget" defaultValue={[50]} max={100} step={1} />
          </div> */}

					<div className="filter-action">
						<h5>Genre</h5>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Choose genre" />
							</SelectTrigger>
							<SelectContent className="fillDropdown">
								<SelectItem value="Jazz">Jazz</SelectItem>
								<SelectItem value="Pop">Pop</SelectItem>
								<SelectItem value="Rock">Rock</SelectItem>
								<SelectItem value="Indie">Indie</SelectItem>
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
								<SelectItem value="Guitar">Guitar</SelectItem>
								<SelectItem value="Drum">Drum</SelectItem>
								<SelectItem value="Songwriter">
									Songwriter
								</SelectItem>
								<SelectItem value="Producer">
									Producer
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* <div className="filter-action">
            <h5>Available Dates</h5>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </div> */}
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
	minRate: number | null;
	maxRate: number | null;
	onApplyFilters: (minRate: number | null, maxRate: number | null) => void;
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

	// When component receives new props, update local state
	useEffect(() => {
		setLocalMinRate(minRate);
		setLocalMaxRate(maxRate);
	}, [minRate, maxRate]);

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
							value={localMinRate !== null ? localMinRate : ""}
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
							value={localMaxRate !== null ? localMaxRate : ""}
							onChange={(e) =>
								setLocalMaxRate(Number(e.target.value))
							}
						/>
					</div>

					{/* slider doesn't work yet, use input temporarily */}
					{/* <Slider defaultValue={[10]} max={40} step={1} /> */}

					<div className="filter-action">
						<h5>Genre</h5>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Choose genre" />
							</SelectTrigger>
							<SelectContent className="fillDropdown">
								<SelectItem value="Jazz">Jazz</SelectItem>
								<SelectItem value="Pop">Pop</SelectItem>
								<SelectItem value="Rock">Rock</SelectItem>
								<SelectItem value="Indie">Indie</SelectItem>
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
								<SelectItem value="Guitar">Guitar</SelectItem>
								<SelectItem value="Drum">Drum</SelectItem>
								<SelectItem value="Songwriter">
									Songwriter
								</SelectItem>
								<SelectItem value="Producer">
									Producer
								</SelectItem>
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
