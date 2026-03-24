---
description: Sync coaching lessons from Google Calendar to Notion CRM
---

This command syncs coaching lessons from Sam's Google Calendar into the Coaching CRM in Notion.

**Step 1:** Get existing lessons from Notion to know what's already logged:
```bash
cd /home/passwd/sam-morris-website && node --env-file=.env.local scripts/coaching-calendar-sync.js $ARGUMENTS
```

**Step 2:** Search Google Calendar for "lesson" events using the Google Calendar MCP tool (`gcal_list_events` with q="lesson"). Use the days-back value from step 1 output.

**Step 3:** Compare calendar events against existing Notion lessons (by client name + date). For any NEW lessons not in Notion:
- Match the client name from the calendar event title to a Coaching Clients record
- If no client exists, suggest creating one via `/coaching-new`
- Log the lesson via: `node --env-file=.env.local scripts/log-lesson.js "Client Name" --date YYYY-MM-DD --location Location --duration 1hr --hours 1 --notes "Calendar event: {title}"`

**Step 4:** Report what was synced and what was skipped.

Parse calendar event titles for client names — they typically follow patterns like:
- "Lesson Nicole Lustig 1/4"
- "Lesson three of four for Dave Kirby"
- "Lesson with Akane 3/4"
- "Lesson 2/4 with Eric Chai"
- "Judith Ginsburg: Private Lesson with Coach Sam"
