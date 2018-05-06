#!/bin/bash
current_date_time="`date +%Y%m%d%H%M%S`"
curl https://workouts-tracker.herokuapp.com/exercises > ./backups/$current_date_time.json
