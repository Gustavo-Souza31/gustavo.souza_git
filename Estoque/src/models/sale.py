from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    cpf_cnpj = db.Column(db.String(20), unique=True)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.Text)
    
    # Relationship
    sales = db.relationship('Sale', backref='customer', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'cpf_cnpj': self.cpf_cnpj,
            'phone': self.phone,
            'email': self.email,
            'address': self.address
        }

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=True)
    sale_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_value = db.Column(db.Numeric(10, 2), nullable=False)
    total_profit = db.Column(db.Numeric(10, 2), nullable=False)
    responsible_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    responsible = db.relationship('User', backref='sales')
    sale_items = db.relationship('SaleItem', backref='sale', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'customer_name': self.customer.name if self.customer else None,
            'sale_date': self.sale_date.isoformat(),
            'total_value': float(self.total_value),
            'total_profit': float(self.total_profit),
            'responsible_id': self.responsible_id,
            'responsible_name': self.responsible.username if self.responsible else None,
            'items': [item.to_dict() for item in self.sale_items]
        }

class SaleItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sale.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_sale_price = db.Column(db.Numeric(10, 2), nullable=False)
    unit_purchase_cost = db.Column(db.Numeric(10, 2), nullable=False)
    item_profit = db.Column(db.Numeric(10, 2), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sale_id': self.sale_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'quantity': self.quantity,
            'unit_sale_price': float(self.unit_sale_price),
            'unit_purchase_cost': float(self.unit_purchase_cost),
            'item_profit': float(self.item_profit),
            'total_item_value': float(self.unit_sale_price * self.quantity),
            'total_item_profit': float(self.item_profit * self.quantity)
        }

