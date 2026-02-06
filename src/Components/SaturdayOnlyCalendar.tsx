import { useCallback, useEffect, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dialog, IconButton } from '@mui/material';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { CalendarIcon } from '@mui/x-date-pickers';
import { useApplication } from './ApplicationContext/useApplication';
import { type Opkomst } from '../Types';
import type { DateEntry } from './DateEntry';

interface SaturdayOnlyCalendarProps {
  onChange?: (selected: DateEntry) => void;
}

function SaturdayOnlyCalendar(props: SaturdayOnlyCalendarProps) {
  const [open, setOpen] = useState(false);
  const [dateEntries, setDateEntries] = useState<DateEntry[]>();
  const { apiFetch } = useApplication();

  // Function to check if a date is a Saturday
  const isEnabled = (date: Dayjs) => {
    return dateEntries?.find(f => {
      return f.date === date.format('YYYYMMDD');
    });
  };

  const generateDateEntries = useCallback((events: Opkomst[]): DateEntry[] => {
    const dateEntries: DateEntry[] = [];

    events.forEach(event => {
      const opDate = event.Op ? dayjs(event.Op) : null;
      const totDate = event.Tot ? dayjs(event.Tot) : null;

      if (opDate) {
        if (totDate) {
          dateEntries.push({
            date: opDate.format('YYYYMMDD'),
            OpkomstId: event.OpkomstId
          });
          let currentDate = dayjs(opDate);
          while (currentDate.isBefore(totDate)) {
            currentDate = currentDate.add(1, 'day');
            dateEntries.push({
              date: currentDate.format('YYYYMMDD'),
              OpkomstId: event.OpkomstId
            });
          }
        } else {
          dateEntries.push({
            date: opDate.format('YYYYMMDD'),
            OpkomstId: event.OpkomstId
          });
        }
      }
    });

    return dateEntries;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const opkomsten = await apiFetch<Opkomst[]>("/api/opkomsten/list", "POST", { history: false });
      setDateEntries(generateDateEntries(opkomsten.data));
    };
    fetchData();
  }, [apiFetch, generateDateEntries]);

  // Handle date selection
  const handleDateChange = (newDate: PickerValue) => {
    if (newDate && isEnabled(dayjs(newDate))) {
      if (dayjs(newDate) && props.onChange) {
        const found = dateEntries?.find(f => f.date === dayjs(newDate).format("YYYYMMDD"));
        if (found) {
          props.onChange(found);
        }
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
          //value={selectedDate}
          onChange={handleDateChange}
          // Disable non-Saturday dates
          shouldDisableDate={(date) => !isEnabled(date)}
        />
      </Dialog>
    </div>
  );
}

export default SaturdayOnlyCalendar;
