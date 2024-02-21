
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
  } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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



function FilterSidebarGig() {
    // Implement state and handlers as needed for actual functionality
  
    return (
      <Card className="h-full w-1/3 p-5 bg-gray-800 text-white">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Filters</CardTitle>
          
        </CardHeader>
        <CardContent className="space-y-4">
        <div>

        <div className="mb-2 text-sm font-semibold"> Max Budget</div>
        <Input  placeholder="Enter $$$" />

        {/* slider doesn't work yet, use input temporarily */}
        <Slider defaultValue={[10]} max={40} step={1} />
        </div>


          <div style ={{marginBottom: '100px'}}>
            Genre
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Jazz">Jazz</SelectItem>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="Rock">Rock</SelectItem>
                    <SelectItem value="Rock">Indie</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div style ={{marginBottom: '100px'}}>
            Role
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Jazz">Guitar</SelectItem>
                    <SelectItem value="Pop">Drum</SelectItem>
                    <SelectItem value="Rock">Songwriter</SelectItem>
                    <SelectItem value="Rock">Producer</SelectItem>
                </SelectContent>
            </Select>


          </div>


          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          Month   
  <div>
    {["January", "February", "March", "April", "May", "June"].map((month) => (
      <label key={month} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <Checkbox id={month} />
        <span style={{ marginLeft: '10px' }}>{month}</span>
      </label>
    ))}
  </div>
  <div>
    {["July", "August", "September", "October", "November", "December"].map((month) => (
      <label key={month} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <Checkbox id={month} />
        <span style={{ marginLeft: '10px' }}>{month}</span>
      </label>
    ))}
  </div>

         

          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Apply <GrFilter/> </Button>
        </CardFooter>
      </Card>
    );
  }



function FilterSidebarArtist() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
return (
      <Card className="h-full w-1/3 p-5 bg-gray-800 text-white">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Filters</CardTitle>
          
        </CardHeader>
        <CardContent className="space-y-4">
        <div>

        <div className="mb-2 text-sm font-semibold"> Flat Rate</div>
        <Input  placeholder="Enter $$$" />

        {/* slider doesn't work yet, use input temporarily */}
        <Slider defaultValue={[10]} max={40} step={1} />
        </div>

        <div> Group Size</div>
        <Input  placeholder="Number of members" />


          <div style ={{marginBottom: '100px'}}>
            Genre
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Jazz">Jazz</SelectItem>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="Rock">Rock</SelectItem>
                    <SelectItem value="Rock">Indie</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div style ={{marginBottom: '100px'}}>
            Role
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Jazz">Guitar</SelectItem>
                    <SelectItem value="Pop">Drum</SelectItem>
                    <SelectItem value="Rock">Songwriter</SelectItem>
                    <SelectItem value="Rock">Producer</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-md border"
  />

        </CardContent>
        <CardFooter>
          <Button className="w-full">Apply <GrFilter/> </Button>
        </CardFooter>
      </Card>
    );
  }

  export default FilterSidebarGig;

  export {FilterSidebarArtist};