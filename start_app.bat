@echo off

set "current_dir=%cd%"

cd /d "%current_dir%"

start cmd /k python app.py

cd frontend

start cmd /k npm start
