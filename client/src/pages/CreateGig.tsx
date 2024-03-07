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
    const [startTime, setStartTime] = useState(''); // State for start time
    const [endTime, setEndTime] = useState(''); // State for end time
    const [budget, setBudget] = useState('');
    const [genre, setGenre] = useState('');
    const [instrumentRole, setInstrumentRole] = useState('');

    const handleDateSelect = (newDate: Date | undefined) => {
        setDate(newDate); // Set the selected date
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value); // Set the selected start time
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(event.target.value); // Set the selected end time
    };

    // Format date for display
    const formattedDate = date ? format(date, "PPP") : "Pick a date";
    const displayDateTime = date ? `${formattedDate} from ${startTime} to ${endTime}` : formattedDate;

    return (
        <div className="App" id="CreateGigPage">
            <div className="create_gig">
                <h2 className="NewGigTitle">Create New Gig</h2>
                    <div className='new-gig-fields'>
                        <Label className="entryLabel">
                            Gig Title:
                            <Input type="text" value={gigTitle} onChange={(e) => setGigTitle(e.target.value)} />
                        </Label>

                        <Label className="entryLabel">
                            Picture:
                            <Input id="picture" type="file" />
                        </Label>

                        <Label className="entryLabel">
                            Description:
                            <Textarea
                                style={{ width: '100%', height: '150px' }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Label>

                        <Label className="entryLabel">
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

                                Start Time:
                                <Input 
                                    type="time"
                                    value={startTime}
                                    onChange={handleStartTimeChange}
                                    style={{ marginLeft: '10px' }}
                                />
                                End Time:
                                <Input 
                                    type="time"
                                    value={endTime}
                                    onChange={handleEndTimeChange}
                                    style={{ marginLeft: '10px' }}
                                />
                            </div>
                        </Label>

                        <Label className="entryLabel">
                            Budget:
                            <Input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
                        </Label>

                        <Label className="entryLabel">
                            Genre:
                            <Input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
                        </Label>
                        <Label className="entryLabel">
                            Instrument/Role:
                            <Input type="text" value={instrumentRole} onChange={(e) => setInstrumentRole(e.target.value)} />
                        </Label>
                        <div className="button_container">
                        <Button id='create_gig_buttton'>Create Gig</Button>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default CreateGig;

