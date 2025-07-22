from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class StockMovement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    movement_type = db.Column(db.String(20), nullable=False)  # 'entrada', 'saida', 'ajuste'
    quantity = db.Column(db.Integer, nullable=False)
    movement_date = db.Column(db.DateTime, default=datetime.utcnow)
    responsible_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reason = db.Column(db.Text)
    batch = db.Column(db.String(50))
    expiry_date = db.Column(db.Date)
    
    # Relationship
    responsible = db.relationship('User', backref='stock_movements')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'movement_type': self.movement_type,
            'quantity': self.quantity,
            'movement_date': self.movement_date.isoformat(),
            'responsible_id': self.responsible_id,
            'responsible_name': self.responsible.username if self.responsible else None,
            'reason': self.reason,
            'batch': self.batch,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None
        }

