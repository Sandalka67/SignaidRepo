var map = L.map('map').setView([42.7339, 25.4858], 7); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var emergencyMarker = L.marker([42.6977, 23.3219]).addTo(map)
    .bindPopup('<b>Emergency!</b><br>User: Elitsa Nikolova<br>Condition: Heart Disease')
    .openPopup();