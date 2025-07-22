from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    
    # Relationship
    products = db.relationship('Product', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.Text)
    
    # Relationship
    products = db.relationship('Product', backref='supplier', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact': self.contact,
            'phone': self.phone,
            'email': self.email,
            'address': self.address
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    code = db.Column(db.String(50), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    brand = db.Column(db.String(50))
    unit_of_measure = db.Column(db.String(20))
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    purchase_cost = db.Column(db.Numeric(10, 2), nullable=False)
    sale_price = db.Column(db.Numeric(10, 2), nullable=False)
    current_stock = db.Column(db.Integer, default=0)
    minimum_stock = db.Column(db.Integer, default=0)
    maximum_stock = db.Column(db.Integer, default=0)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    active = db.Column(db.Boolean, default=True)
    
    # Relationships
    stock_movements = db.relationship('StockMovement', backref='product', lazy=True)
    sale_items = db.relationship('SaleItem', backref='product', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'code': self.code,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'brand': self.brand,
            'unit_of_measure': self.unit_of_measure,
            'supplier_id': self.supplier_id,
            'supplier_name': self.supplier.name if self.supplier else None,
            'purchase_cost': float(self.purchase_cost),
            'sale_price': float(self.sale_price),
            'current_stock': self.current_stock,
            'minimum_stock': self.minimum_stock,
            'maximum_stock': self.maximum_stock,
            'registration_date': self.registration_date.isoformat(),
            'active': self.active,
            'profit_margin': float(self.sale_price - self.purchase_cost) if self.sale_price and self.purchase_cost else 0
        }

