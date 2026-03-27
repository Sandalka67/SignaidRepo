window.refreshMarkers = function() {
    if (typeof map === 'undefined') return;

    map.eachLayer((layer) => { 
        if (layer instanceof L.CircleMarker) map.removeLayer(layer); 
    });

    const noCacheUrl = '/api/signals?t=' + new Date().getTime();

    fetch(noCacheUrl)
        .then(res => res.json())
        .then(signals => {
            signals.forEach(signal => {
                if (signal.lat && signal.lng) {
                    const marker = L.circleMarker([signal.lat, signal.lng], {
                        radius: 12, fillColor: "red", color: "white", weight: 2, fillOpacity: 0.9
                    }).addTo(map);
                   marker.bindPopup(`
                        <div style="text-align: center;">
                            <strong style="color: red;">🚨 Emergency Signal</strong><br>
                            <b>${signal.user_name || 'User'}</b><br>
                            <small>Conditions: ${signal.conditions || 'None'}</small>
                        </div>
                    `);
                }
            });
        });
};
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

window.updateStatsUI = function(stats) {

    if (!stats) return; 

    if (document.getElementById('stat-total')) {
        document.getElementById('stat-total').innerText = stats.total_signals;
    }
    if (document.getElementById('stat-active')) {
        document.getElementById('stat-active').innerText = stats.active_signals;
    }
    if (document.getElementById('stat-resolved')) {
        document.getElementById('stat-resolved').innerText = stats.resolved;
    }
};

window.toggleEmergency = function() {
    const btn = document.getElementById('main-action-btn');

    const isCurrentlyActive = btn.getAttribute('data-active') === 'true';

    btn.disabled = true;
    btn.innerText = "PROCESSING...";

    if (!isCurrentlyActive) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                fetch('/api/signal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                })
                .then(res => res.json())
                .then(data => {
                    btn.setAttribute('data-active', 'true');
                    btn.classList.remove('btn-emergency');
                    btn.classList.add('btn-resolved'); 
                    btn.innerText = "✅ RESOLVE EMERGENCY";
                    btn.disabled = false;

                    if (data.stats) window.updateStatsUI(data.stats);
                    window.refreshMarkers(); 
                });
            }, () => {
                alert("Please enable GPS services.");
                btn.disabled = false;
                btn.innerText = "⚠️ EMERGENCY ⚠️";
            });
        }
    } else {
        fetch('/api/resolve', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            btn.setAttribute('data-active', 'false');
            btn.classList.remove('btn-resolved');
            btn.classList.add('btn-emergency'); 
            btn.innerText = "⚠️ EMERGENCY ⚠️";
            btn.disabled = false;

            if (data.stats) window.updateStatsUI(data.stats);
            window.refreshMarkers(); 
        });
    }
};