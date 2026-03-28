# SignaidRepo
> Emergency aid for remote communities. > Built for HackTUES12 by Syrax.

## About The Project
In critical moments, every second counts. "Signaid" is a real-time web application designed to bridge the gap between individuals in distress and emergency responders. By utilizing browser-based geolocation and a dynamic interactive map, Sigmaid allows users to broadcast their exact coordinates and relevant medical conditions instantly.

Whether in a remote village or a crowded city, "Signaid" provides a clean, panic-proof interface to get help on the map.

## Key Features
* One-Click SOS: A highly visible, accessible emergency button that instantly grabs the user's GPS coordinates (Latitude/Longitude).
* Live Map Visualization: Powered by Leaflet.js and OpenStreetMap, active signals are immediately plotted on a live map of Bulgaria.
* Smart Medical Context: Users can pre-select medical conditions (e.g., Hypertension, Heart Disease) on their profile, which are attached to their emergency signal for responders to see.
* Dynamic Dashboard: Real-time UI updates track the community impact, showing Total Signals, Active Emergencies, and Resolved cases without requiring a page refresh.
* State Management: Built-in safeguards prevent users from spamming the network, locking the UI into an "Active" state until the emergency is safely resolved.

## Built With
* Frontend:
* HTML5 & CSS3
* JavaScript (Vanilla DOM Manipulation & Fetch API)
* Bootstrap 5 (Responsive UI & Styling)
* Leaflet.js (Interactive Mapping)

Backend:
* Python 3
* Flask (RESTful API & Routing)
* SQLite / SQLAlchemy (Database & User Management)

## How to Run Locally:
### 1. Prerequisites
Make sure you have Python installed. You can check by typing `python --version` in your terminal.
### 2. Folder Structure
Your project directory should look like this:
```text
