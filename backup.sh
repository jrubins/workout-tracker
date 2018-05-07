#!/bin/bash
current_date_time="`date +%Y%m%d%H%M%S`"
curl --header "X-API-KEY: fafuid7823uhf567ui2" https://workouts-tracker.herokuapp.com/backups > ./backups/$current_date_time.json
