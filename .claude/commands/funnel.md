---
description: Show the website lead → Hub conversion funnel report
---

Run the lead funnel report by executing the following Node.js script. Source env vars from `/home/passwd/sam-morris-website/.env.local` first.

```bash
cd /home/passwd/sam-morris-website && node --env-file=.env.local scripts/funnel-report.js $ARGUMENTS
```

Present the output as a formatted report. If the user provides a number as an argument (e.g., `/funnel 30`), that's the number of days to look back.

Highlight:
- The overall conversion rate (leads → attended)
- Which interest type converts best
- Any leads stuck at a stage for > 7 days (needs attention)
- Actionable recommendations based on the data
