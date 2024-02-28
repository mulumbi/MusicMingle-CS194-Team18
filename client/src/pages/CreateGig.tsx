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
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState(''); // New state for time
    const [budget, setBudget] = useState('');
    const [genre, setGenre] = useState('');
    const [instrumentRole, setInstrumentRole] = useState('');

    const handleDateSelect = (newDate: Date | undefined) => {
        setDate(newDate); // Set the selected date
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTime(event.target.value); // Set the selected time
    };

    // Format date and time for display
    const formattedDate = date ? format(date, "PPP") : "Pick a date";
    const displayDateTime = date ? `${formattedDate} at ${time}` : formattedDate;

    return (
        <div className="App" id="ArtistPageApp">
            <div>
                <div className="NewGigTitle">Create New Gig</div>
                <div className='create_gig_body' id="CreateGigBody">
                    <div className='new-gig-fields'>
                    <div className='new-gig-fields'>
                        <Label>
                            Gig Title:
                            <Input type="text" value={gigTitle} onChange={(e) => setGigTitle(e.target.value)} />
                        </Label>

                        <Label>
                            Picture:
                            <Input id="picture" type="file" />
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
                            <div className="datetime-picker">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">
                                            <FaCalendar className="calendar-icon" />
                                            <span>{displayDateTime}</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="select-date">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={handleDateSelect}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Input 
                                    type="time"
                                    value={time}
                                    onChange={handleTimeChange}
                                    style={{ marginLeft: '10px' }}
                                />
                            </div>
                        </Label>

                        <Label>
                            Budget:
                            <Input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
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
                </div>
            </div>
            </div>
        </div>
    );
}
                    

export default CreateGig;

