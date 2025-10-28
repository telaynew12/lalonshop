import { useState, useEffect } from 'react';

function useFormattedDateTime(dateTimeString) {
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    if (dateTimeString) {
      // Parse the input date string
      const date = new Date(dateTimeString);
      
      // Format date as YYYY-MM-DD using local timezone
      const datePart = date.toLocaleDateString('en-CA'); // 'en-CA' provides YYYY-MM-DD format
      
      // Extract hours and minutes
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      // Determine AM/PM
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Convert hours to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // If hours is 0, make it 12 (for 12 AM)

      // Format time as H:MM AM/PM
      const timePart = `${hours}:${minutes} ${ampm}`;
      
      // Set the formatted date and time
      setFormattedDate(datePart);
      setFormattedTime(timePart);
    }
  }, [dateTimeString]);

  return { formattedDate, formattedTime };
}

export default useFormattedDateTime;
