
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Slider } from "@/components/ui/slider";
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
import {CustomSlider} from "@/components/CustomSlider";
import * as Slider from '@radix-ui/react-slider';


interface FilterSidebarGigProps {
  minBudget: number;  // Define the expected type for minBudget
  maxBudget: number;  // Define the expected type for maxBudget
}

const FilterSidebarGig: React.FC<FilterSidebarGigProps> = ({ minBudget, maxBudget }) => {
  // const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [minBudgetValue, setMinBudgetValue] = React.useState(minBudget);
  const [maxBudgetValue, setMaxBudgetValue] = React.useState(maxBudget);


  return (

    <Card id="Filterbar">
      <CardHeader className="filterbar-header">
        <CardTitle>Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <div>

          <div className="filter-action">
            <h5>Budget</h5>
            <Input 
              type="number"
              placeholder="Enter minimum $$$" 
              value={minBudgetValue} 
              onChange={(e) => setMinBudgetValue(Number(e.target.value))}
            />
            <Input 
              type="number"
              placeholder="Enter maximum $$$" 
              value={maxBudgetValue} 
              onChange={(e) => setMaxBudgetValue(Number(e.target.value))}
            />
          </div>

          {/* <div className="filter-action">
            <CustomSlider label="Budget" defaultValue={[50]} max={100} step={1} />
          </div> */}


          <div className="filter-action" >
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
            <Select className="dropdown">
              <SelectTrigger>
                <SelectValue placeholder="Choose role" />
              </SelectTrigger>
              <SelectContent className="fillDropdown">
                <SelectItem value="Guitar">Guitar</SelectItem>
                <SelectItem value="Drum">Drum</SelectItem>
                <SelectItem value="Songwriter">Songwriter</SelectItem>
                <SelectItem value="Producer">Producer</SelectItem>
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
        <Button className="apply-button">Apply <GrFilter /> </Button>
      </CardFooter>
    </Card>
  );
}



type FilterSidebarArtistProps = {
  rate: number;
};

const FilterSidebarArtist: React.FC<FilterSidebarArtistProps> = ({ rate }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [rateVal, setRateVal] = React.useState(rate);

  return (
    <Card id="Filterbar">
      <CardHeader className="filterbar-header">
        <CardTitle>Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <div>
          <div className="filter-action">
            <h5>Flat Rate</h5>
            <Input 
              type="number"
              placeholder="Enter $$$" 
              value={rateVal} 
              onChange={(e) => setRateVal(Number(e.target.value))}
            />

          </div>
          {/* slider doesn't work yet, use input temporarily */}
          {/* <Slider defaultValue={[10]} max={40} step={1} /> */}
        </div>

        {/* <div className="filter-action">
          <h5>Group Size</h5>
          <Input placeholder="Number of members" />
        </div> */}


        <div className="filter-action" >
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
          <Select className="dropdown">
            <SelectTrigger>
              <SelectValue placeholder="Choose role" />
            </SelectTrigger>
            <SelectContent className="fillDropdown">
              <SelectItem value="Guitar">Guitar</SelectItem>
              <SelectItem value="Drum">Drum</SelectItem>
              <SelectItem value="Songwriter">Songwriter</SelectItem>
              <SelectItem value="Producer">Producer</SelectItem>
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

      </CardContent>
      <CardFooter>
        <Button className="apply-button">Apply <GrFilter /> </Button>
      </CardFooter>
    </Card>
  );
}

export default FilterSidebarGig;

export { FilterSidebarArtist };