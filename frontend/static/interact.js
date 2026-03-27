document.addEventListener("DOMContentLoaded", () => {
    if (typeof map !== 'undefined' && document.getElementById('map')) {
        fetch('/api/signals')
            .then(res => res.json())
            .then(signals => {
                signals.forEach(signal => {
                    const marker = L.circleMarker([signal.lat, signal.lng], {
                        radius: 10, fillColor: "red", color: "white", weight: 2, fillOpacity: 0.8
                    }).addTo(map);
                    
                    marker.bindPopup(`
                        <div style="text-align: center;">
                            <strong style="color: red;">🚨 Emergency Signal</strong><br>
                            <b>${signal.user_name || 'User'}</b><br>
                            <small>Conditions: ${signal.conditions || 'None'}</small>
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
                if (hiddenInput) {
                    const activeTags = Array.from(document.querySelectorAll('.condition-tag.active'))
                                            .map(t => t.innerText);
                    hiddenInput.value = activeTags.join(', ');
                }
            });
        });
    }
});

window.sendSignal = function(lat, lng) {
    const emergencyBtn = document.getElementById('emergency-btn');
    const data = { lat: lat, lng: lng, user_id: 1 }; 

    fetch('/api/signals')
    .then(res => res.json())
    .then(signals => {
        console.log("Here is the raw data from the database:", signals); 
        signals.forEach(signal => {
            console.log("Checking signal:", signal);
            if (signal.lat !== undefined && signal.lng !== undefined && signal.lat !== null) {
                const lat = parseFloat(signal.lat);
                const lng = parseFloat(signal.lng);
                const marker = L.circleMarker([lat, lng], {
                    radius: 10, fillColor: "red", color: "white", weight: 2, fillOpacity: 0.8
                }).addTo(map);
                marker.bindPopup(`
                    <div style="text-align: center;">
                        <strong style="color: red;">🚨 Emergency Signal</strong><br>
                        <b>${signal.user_name || 'User'}</b><br>
                        <small>Conditions: ${signal.conditions || 'None'}</small>
                    </div>
                `);
            } else {
                console.warn("⚠️ SKIPPED BAD SIGNAL DATA:", signal);
            }
        });
    })
    .catch(err => console.error("Error loading map signals:", err));
};