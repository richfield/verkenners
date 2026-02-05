import { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dialog, IconButton } from '@mui/material';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { CalendarIcon } from '@mui/x-date-pickers';

interface SaturdayOnlyCalendarProps {
  onChange?: (selected: Dayjs) => void;
}
function SaturdayOnlyCalendar(props: SaturdayOnlyCalendarProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Function to check if a date is a Saturday
  const isSaturday = (date: Dayjs) => {
    return date.day() === 6; // 6 = Saturday
  };

  // Handle date selection
  const handleDateChange = (newDate: PickerValue) => {
    if (newDate && isSaturday(dayjs(newDate))) {
      setSelectedDate(dayjs(newDate));
      if (selectedDate && props.onChange) {
        props.onChange(selectedDate);
      }
      setOpen(false);
    }
  };

  return (
    <div>
      <IconButton onClick={() => setOpen(true)} aria-label="back">
        <CalendarIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          // Disable non-Saturday dates
          shouldDisableDate={(date) => !isSaturday(date)}
        />
      </Dialog>
      {selectedDate && (
        <p>Selected Saturday: {selectedDate.format('LL')}</p>
      )}
    </div>
  );
}

export default SaturdayOnlyCalendar;
