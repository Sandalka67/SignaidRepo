from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    
    health_conditions = db.Column(db.Text, nullable=True) 
    additional_notes = db.Column(db.Text, nullable=True)
    
    signals = db.relationship('Signal', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.full_name,
            'phone': self.phone_number,
            'conditions': self.health_conditions,
            'notes': self.additional_notes
        }

class Signal(db.Model):
    __tablename__ = 'signals'
    
    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
   
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    status = db.Column(db.String(20), default='active') 
    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name,
            'conditions': self.user.health_conditions,
            'lat': self.latitude,
            'lng': self.longitude,
            'status': self.status,
            'time': self.timestamp.isoformat()
        }