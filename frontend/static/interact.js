document.addEventListener("DOMContentLoaded", () => {

    const emergencyBtn = document.getElementById('emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            emergencyBtn.disabled = true;
            emergencyBtn.innerText = "Locating...";

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => sendSignal(position.coords.latitude, position.coords.longitude),
                    (error) => {
                        alert("Please enable location services to send an emergency signal.");
                        emergencyBtn.disabled = false;
                        emergencyBtn.innerText = "⚠️ EMERGENCY";
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        });
    }

    function sendSignal(lat, lng) {
        const data = { lat: lat, lng: lng, user_id: 1 }; 

        fetch('/api/signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert("Signal sent successfully! Help is on the map.");
            window.location.href = "/map"; 
        })
        .catch(err => {
            console.error("Error sending signal:", err);
            alert("Failed to send signal. Please try again.");
            document.getElementById('emergency-btn').disabled = false;
            document.getElementById('emergency-btn').innerText = "⚠️ EMERGENCY";
        });
    }

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        const map = L.map('map').setView([42.7339, 25.4858], 7); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        fetch('/api/signals')
            .then(res => res.json())
            .then(signals => {
                signals.forEach(signal => {
                    const marker = L.marker([signal.lat, signal.lng]).addTo(map);
                    marker.bindPopup(`
                        <div style="text-align: center;">
                            <strong style="color: red;">🚨 Emergency Signal</strong><br>
                            <b>${signal.user_name}</b><br>
                            <small>Conditions: ${signal.conditions}</small>
                        </div>
                    `);
                });
            })
            .catch(err => console.error("Error loading map signals:", err));
    }

    const tags = document.querySelectorAll('.condition-tag');
    const hiddenInput = document.getElementById('selected-conditions-input'); 

    if (tags.length > 0) {
        tags.forEach(tag => {
            tag.addEventListener('click', function() {
                this.classList.toggle('active');
                
                updateHiddenInput();
            });
        });
    }

    function updateHiddenInput() {
        if (!hiddenInput) return;
        const activeTags = Array.from(document.querySelectorAll('.condition-tag.active'))
                                .map(tag => tag.innerText);
        hiddenInput.value = activeTags.join(', ');
    }
});