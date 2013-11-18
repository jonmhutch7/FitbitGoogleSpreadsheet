Fitbit Google Spreadsheet Script
=======================

A google spreadsheet script based on https://github.com/loghound/Fitbit-for-Google-App-Script. Adds in extra data metrics as well as fields for specific dates.

Before you do anything, create an account and a new app on api.fitbit.com. This is the only way you'll be able to pull in fitbit data.

The following fitbit data will be pulled in with this script:
- Steps
- Distance
- Active Score
- Minutes Sedentary
- Minutes Lightly Active
- Minutes Fairly Active
- Minutes Very Active
- Start Time
- Time In Bed
- Minutes Asleep
- Awakenings Count
- Minutes Awake
- Minutes To Fall Asleep
- Minutes After Wakeup
- Efficiency

To install, first create a google spreadsheet. Then, navigate to 'tools > script editor', and in the new window, click 'Blank Project' in the dialog, and then paste all text from 'script.js' into the textarea. Save the script and click 'Run' at the top of the page under the script title. You will be prompted to authorize your fitbit credentials. This will authorize your account in both the script editor and the spreadsheet. You can now go back to your spreadsheet and reload the page. Once reloaded, a new menu option should appear called 'Fitbit', which should be located right next to 'Help' under the title of the spreadsheet. A dialog should open up containing your fitbit credentials as well as two fields for a start and end date. Fill in the specified start and end date you would like, save the configuration and then click 'Refresh Fitbit Data'. Your data should appear in the rows. Row 1 is frozen, so that you can add in specified row titles.  
