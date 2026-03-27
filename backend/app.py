import os
from flask import Flask, render_template, request, jsonify, redirect, url_for
from database.models import db, User, EmergencySignal

app = Flask(__name__, 
            template_folder="../frontend/templates", 
            static_folder="../frontend/static")

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sigmaid.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    if not User.query.first():
        demo_user = User(
            full_name="----",
            email="----",
            phone="----",
            health_conditions="Heart Disease, Hypertension",
            notes="Allergic to Penicillin. Takes blood thinners."
        )
        db.session.add(demo_user)
        db.session.commit()

def get_stats():
    stats = {
        "users": User.query.count(),
        "total_signals": EmergencySignal.query.count(),
        "active_signals": EmergencySignal.query.filter_by(is_active=True).count(),
        "resolved": EmergencySignal.query.filter_by(is_active=False).count()
    }

    return stats

@app.route('/')
def index():
    stats = get_stats()
    active_event = EmergencySignal.query.filter_by(user_id=1, is_active=True).first()
    has_active = True if active_event else False
    
    return render_template('index.html', stats=stats, has_active=has_active)

@app.route('/map')
def map_view():
    return render_template('map.html')

@app.route('/api/signal', methods=['POST'])
def create_signal():
    data = request.json
    
    new_signal = EmergencySignal(
        user_id=1, # Hardcoded for now
        lat=data['lat'],
        lng=data['lng'],
        is_active=True,
        # Save the modal data to the new columns!
        emergency_causes=data.get('conditions', ''),
        extra_details=data.get('notes', '') 
    )
    db.session.add(new_signal)
    db.session.commit()
    
    return jsonify({"status": "created", "stats": get_stats()})

@app.route('/api/signals')
def get_signals():
    active_signals = EmergencySignal.query.filter_by(is_active=True).all()
    signal_data = []
    
    for sig in active_signals:
        u = sig.user 
        signal_data.append({
            "lat": sig.lat,
            "lng": sig.lng,
            "user_name": u.full_name if u else 'Unknown',
            "phone": u.phone if u else 'N/A',
            "email": u.email if u else 'N/A',
            # Send the new columns to the frontend!
            "causes": sig.emergency_causes if sig.emergency_causes else 'Not specified',
            "details": sig.extra_details if sig.extra_details else 'None'
        })
        
    return jsonify(signal_data)

@app.route('/api/resolve', methods=['POST'])
def resolve_signal():
    active_signal = EmergencySignal.query.filter_by(user_id=1, is_active=True).first()
    if active_signal:
        active_signal.is_active = False
        db.session.commit()

    return jsonify({"status": "resolved", "stats": get_stats()})

@app.route('/api/signals', methods=['GET'])
def get_active_signals():
    # 1. Fetch all active signals from the DB
    active_signals = EmergencySignal.query.filter_by(is_active=True).all()
    
    signal_data = []
    for signal in active_signals:
        # 2. Access the User associated with this signal 
        # (Assumes you have a db.relationship('User') in your EmergencySignal model)
        user = signal.user 
        
        # 3. Build the dictionary with all the data
        signal_data.append({
            "lat": signal.lat,
            "lng": signal.lng,
            "user_name": user.full_name if user else 'Unknown User',
            "phone": user.phone_number if user else 'N/A',
            "email": user.email if user else 'N/A',
            "conditions": user.health_conditions if user.health_conditions else 'Not specified', # From the modal chips
            "notes": user.notes if signal.details else 'None'            # From the modal text area
        })
        
    # 4. Send the enriched data to the frontend
    return jsonify(signal_data)

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    user = User.query.get(1)
    
    if request.method == 'POST':
        user.phone = request.form.get('phone')
        user.notes = request.form.get('notes')
        user.health_conditions = request.form.get('health_conditions')
        
        db.session.commit()
        return redirect(url_for('profile'))

    return render_template('profile.html', user=user)

if __name__ == '__main__':
    app.run(debug=True, port=5000)