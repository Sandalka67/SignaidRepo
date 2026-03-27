function buildPopupMessage(signal) {
    return `<div style="text-align: left; min-width: 220px; font-family: Arial, sans-serif;">   
                <div style="text-align: center; border-bottom: 2px solid #ffcccc; padding-bottom: 8px; margin-bottom: 10px;">
                    <strong style="color: #d62828; font-size: 1.1em;">🚨 Emergency Signal</strong>
                </div>
                
                <b style="font-size: 1.1em;">👤 ${signal.user_name}</b><br>
                📞 <a href="tel:${signal.phone}" style="text-decoration: none; color: #0056b3;">${signal.phone}</a><br>
                ✉️ <a href="mailto:${signal.email}" style="text-decoration: none; color: #0056b3;">${signal.email}</a><br>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                
                <div style="background-color: #f8f9fa; padding: 8px; border-radius: 6px;">
                    <small><b>Users health conditions:</b> <span style="color: #d62828;">${signal.health_conditions}</span></small><br>
                    <small><b>Additional health notes:</b> ${signal.notes}</small><br>
                    <small><b>Cause of emergency:</b> <span style="color: #d62828;">${signal.causes}</span></small><br>
                    <small><b>Details:</b> ${signal.details}</small><br>
                    <small style="color: #6c757d; display: block; margin-top: 5px;">
                        <b>🗺️Map:</b> <a href="https://www.google.com/maps?q=${signal.lat},${signal.lng}" target="_blank" rel="noopener noreferrer" style="color: #0056b3; text-decoration: underline;">View on Google Maps</a>
                    </small>
                </div>
            </div>`;
}

window.refreshMarkers = function () {
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
                    // marker.bindPopup(buildPopupMessage(signal));
                    marker.bindPopup(buildPopupMessage(signal));
                }
            });
        })
        .catch(err => console.error("Error loading map signals:", err));
};

window.updateStatsUI = function (stats) {
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

window.toggleEmergency = function () {
    const btn = document.getElementById('main-action-btn');
    const isCurrentlyActive = btn.getAttribute('data-active') === 'true';

    if (!isCurrentlyActive) {
        const myModal = new bootstrap.Modal(document.getElementById('emergencyDetailsModal'));
        myModal.show();
    } else {
        btn.disabled = true;
        btn.innerText = "PROCESSING...";

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
            })
            .catch(err => {
                console.error("Error resolving:", err);
                btn.disabled = false;
                btn.innerText = "✅ RESOLVE EMERGENCY";
            });
    }
};


document.addEventListener("DOMContentLoaded", () => {

    window.refreshMarkers();

    const chips = document.querySelectorAll('.emergency-chip');
    const submitBtn = document.getElementById('confirm-emergency-btn');
    const detailsInput = document.getElementById('emergency-details-input');
    const mainBtn = document.getElementById('main-action-btn');

    if (chips.length > 0) {
        chips.forEach(chip => {
            chip.addEventListener('click', function () {
                this.classList.toggle('active');

                const activeCount = document.querySelectorAll('.emergency-chip.active').length;
                if (submitBtn) {
                    submitBtn.disabled = activeCount === 0;
                }
            });
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const selectedTypes = Array.from(document.querySelectorAll('.emergency-chip.active'))
                .map(chip => chip.innerText).join(', ');
            const additionalDetails = detailsInput ? detailsInput.value : "";

            submitBtn.disabled = true;
            submitBtn.innerText = "Locating GPS...";

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;

                    fetch('/api/signal', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            lat: lat,
                            lng: lng,
                            conditions: selectedTypes,
                            notes: additionalDetails
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            const modalElement = document.getElementById('emergencyDetailsModal');
                            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                            modalInstance.hide();

                            submitBtn.innerText = "Send Emergency Signal";
                            submitBtn.disabled = true;
                            chips.forEach(c => c.classList.remove('active'));
                            if (detailsInput) detailsInput.value = "";

                            if (mainBtn) {
                                mainBtn.setAttribute('data-active', 'true');
                                mainBtn.classList.remove('btn-emergency');
                                mainBtn.classList.add('btn-resolved');
                                mainBtn.innerText = "✅ RESOLVE EMERGENCY";
                            }

                            if (data.stats) window.updateStatsUI(data.stats);
                            window.refreshMarkers();
                            if (typeof map !== 'undefined');
                        })
                        .catch(err => {
                            console.error("Fetch error:", err);
                            submitBtn.innerText = "Send Emergency Signal";
                            submitBtn.disabled = false;
                            alert("Network error. Please try again.");
                        });
                }, () => {
                    alert("Please enable GPS services to send an emergency signal.");
                    submitBtn.innerText = "Send Emergency Signal";
                    submitBtn.disabled = false;
                }, { enableHighAccuracy: true });
            } else {
                alert("Geolocation is not supported by your browser.");
                submitBtn.disabled = false;
            }
        });
    }

    const profileTags = document.querySelectorAll('.condition-tag');
    const hiddenInput = document.getElementById('selected-conditions-input');

    if (profileTags.length > 0) {
        profileTags.forEach(tag => {
            tag.addEventListener('click', function () {
                this.classList.toggle('active');
                if (hiddenInput) {
                    const activeTags = Array.from(document.querySelectorAll('.condition-tag.active')).map(t => t.innerText);
                    hiddenInput.value = activeTags.join(', ');
                }
            });
        });
    }
});