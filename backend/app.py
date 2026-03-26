import os
from flask import Flask, render_template, request, jsonify, redirect, url_for
from database.models import db, User, EmergencySignal

app = Flask(__name__, 
            template_folder=os.path.abspath('../frontend/templates'),
            static_folder=os.path.abspath('../frontend/static'))

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

@app.route('/')
def index():
    stats = {
        "users": User.query.count(),
        "total_signals": EmergencySignal.query.count(),
        "active_signals": EmergencySignal.query.filter_by(is_active=True).count(),
        "resolved": EmergencySignal.query.filter_by(is_active=False).count()
    }
    return render_template('index.html', stats=stats)

@app.route('/map')
def map_view():
    return render_template('map.html')

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    user = User.query.get(1)
    
    if request.method == 'POST':
        user.phone = request.form.get('phone')
        user.notes = request.form.get('notes')
        db.session.commit()
        return redirect(url_for('profile'))
        
    return render_template('profile.html', user=user)

@app.route('/api/signal', methods=['POST'])
def create_signal():
    data = request.json
    new_signal = EmergencySignal(
        user_id=1, 
        lat=data.get('lat'), 
        lng=data.get('lng'),
        is_active=True
    )
    db.session.add(new_signal)
    db.session.commit()
    return jsonify({"status": "success", "message": "Signal transmitted!"})

@app.route('/api/signals', methods=['GET'])
def get_active_signals():
    signals = EmergencySignal.query.filter_by(is_active=True).all()
    result = []
    for s in signals:
        result.append({
            "lat": s.lat,
            "lng": s.lng,
            "username": s.user.full_name,
            "conditions": s.user.health_conditions,
            "notes": s.user.notes
        })
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)