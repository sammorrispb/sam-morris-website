---
description: Book a court on CourtReserve for a coaching lesson from Google Calendar
---

When Sam says "book court" or a new lesson appears on the calendar, do this:

1. **Check Google Calendar** for upcoming lessons using gcal_list_events MCP tool:
   - Search for appointment schedule bookings (look for events with attendees that aren't Sam)
   - Extract: player name, email, date, time, location

2. **Determine location** from the event's location field:
   - "Rockville" or "Southlawn" → Rockville (org 10869)
   - "North Bethesda" or "Boiling Brook" → North Bethesda (org 10483)

3. **Book court on CourtReserve** using the Hub's CR client:
   ```bash
   cd /home/passwd/the-hub && node --env-file=.env.local -e "
   import { CourtReserveClient } from './api/_lib/cr-client/client.js';
   const client = new CourtReserveClient('LOCATION');
   const result = await client.call('createBooking', {
     Date: 'YYYY-MM-DD',
     StartTime: 'HH:MM',
     EndTime: 'HH:MM',
     CourtIds: ['COURT_ID'],
     ReservationTypeId: 'private_lesson',
     Description: 'Private Lesson - PLAYER_NAME',
   });
   console.log(result);
   "
   ```

4. **Log the lesson** in the coaching CRM:
   ```bash
   cd /home/passwd/sam-morris-website && node --env-file=.env.local scripts/log-lesson.js "PLAYER_NAME" --date YYYY-MM-DD --location LOCATION --duration 1hr --hours 1 --notes "Booked via Google Calendar appointment"
   ```

5. **Confirm to Sam** what was booked.
