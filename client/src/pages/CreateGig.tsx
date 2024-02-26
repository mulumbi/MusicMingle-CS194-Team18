import React, { useState } from 'react';
// Import CSSProperties for TypeScript validation of inline styles
import { CSSProperties } from 'react';
// Import custom components
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

import { FaCalendar } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

function CreateGig() {
    const [gigTitle, setGigTitle] = useState('');
    const [picture, setPicture] = useState(null);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [budget, setBudget] = useState('');
    const [openings, setOpenings] = useState('');   
    const [genre, setGenre] = useState('');
    const [instrumentRole, setInstrumentRole] = useState('');

    // Define your form style with the correct TypeScript type
    const formStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '50px',
        alignContent: 'center',
    };

    const handleDateSelect = (newDate: Date | undefined) => {
        setDate(newDate); // Wrapping setDate to match SelectSingleEventHandler type
    };

    return (
        <div style={formStyle}>
            <h1>Create New Gig</h1>

            <Label>
                Gig Title:
                <Input type="text" value={gigTitle} onChange={(e) => setGigTitle(e.target.value)} />
            </Label>

            <Label>
                Picture:     
                <Input id="picture" type="file"/> 
            </Label>
          

            <Label> 
                Description: 
                <Textarea
                    style={{ width: '100%', height: '150px' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Label>

            <Label>
                Date and Time:
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">
                            <FaCalendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </Label>


            <Label>
                Budget:
                <Input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </Label>
            <Label>
                Openings:
                <Input type="text" value={openings} onChange={(e) => setOpenings(e.target.value)} />
            </Label>
            <Label>
                Genre:
                <Input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
            </Label>
            <Label>
                Instrument/Role:
                <Input type="text" value={instrumentRole} onChange={(e) => setInstrumentRole(e.target.value)} />
            </Label>

            <Button>Create Gig</Button>
        </div>
    );
}

export default CreateGig;