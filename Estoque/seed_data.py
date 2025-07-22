#!/usr/bin/env python3
"""
Script to seed the database with initial data
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db, User
from src.models.product import Category, Supplier, Product
from src.models.stock import StockMovement
from src.models.sale import Customer, Sale, SaleItem
from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), '..', 'database', 'app.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app

def seed_database():
    app = create_app()
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if admin user already exists
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            # Create admin user
            admin_user = User(
                username='admin',
                full_name='Administrador do Sistema',
                email='admin@sistema.com',
                access_level='administrador'
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            print("✓ Admin user created")
        else:
            print("✓ Admin user already exists")
        
        # Create sample categories
        categories_data = [
            {'name': 'Eletrônicos', 'description': 'Produtos eletrônicos e tecnologia'},
            {'name': 'Roupas', 'description': 'Vestuário e acessórios'},
            {'name': 'Casa e Jardim', 'description': 'Produtos para casa e jardim'},
            {'name': 'Esportes', 'description': 'Artigos esportivos e fitness'},
            {'name': 'Livros', 'description': 'Livros e material educativo'}
        ]
        
        for cat_data in categories_data:
            category = Category.query.filter_by(name=cat_data['name']).first()
            if not category:
                category = Category(**cat_data)
                db.session.add(category)
                print(f"✓ Category '{cat_data['name']}' created")
        
        # Create sample suppliers
        suppliers_data = [
            {
                'name': 'TechSupplier Ltda',
                'contact': 'João Silva',
                'phone': '(11) 99999-1111',
                'email': 'contato@techsupplier.com',
                'address': 'Rua da Tecnologia, 123 - São Paulo, SP'
            },
            {
                'name': 'Moda & Estilo',
                'contact': 'Maria Santos',
                'phone': '(11) 99999-2222',
                'email': 'vendas@modaestilo.com',
                'address': 'Av. da Moda, 456 - São Paulo, SP'
            },
            {
                'name': 'Casa Bella',
                'contact': 'Pedro Oliveira',
                'phone': '(11) 99999-3333',
                'email': 'pedidos@casabella.com',
                'address': 'Rua do Lar, 789 - São Paulo, SP'
            }
        ]
        
        for sup_data in suppliers_data:
            supplier = Supplier.query.filter_by(name=sup_data['name']).first()
            if not supplier:
                supplier = Supplier(**sup_data)
                db.session.add(supplier)
                print(f"✓ Supplier '{sup_data['name']}' created")
        
        # Commit categories and suppliers first
        db.session.commit()
        
        # Create sample products
        products_data = [
            {
                'name': 'Smartphone Samsung Galaxy',
                'description': 'Smartphone Android com 128GB de armazenamento',
                'code': 'TECH001',
                'category_name': 'Eletrônicos',
                'brand': 'Samsung',
                'unit_of_measure': 'unidade',
                'supplier_name': 'TechSupplier Ltda',
                'purchase_cost': 800.00,
                'sale_price': 1200.00,
                'current_stock': 15,
                'minimum_stock': 5,
                'maximum_stock': 50
            },
            {
                'name': 'Notebook Dell Inspiron',
                'description': 'Notebook para uso profissional com 8GB RAM',
                'code': 'TECH002',
                'category_name': 'Eletrônicos',
                'brand': 'Dell',
                'unit_of_measure': 'unidade',
                'supplier_name': 'TechSupplier Ltda',
                'purchase_cost': 2000.00,
                'sale_price': 2800.00,
                'current_stock': 8,
                'minimum_stock': 3,
                'maximum_stock': 20
            },
            {
                'name': 'Camiseta Polo',
                'description': 'Camiseta polo masculina 100% algodão',
                'code': 'ROUPA001',
                'category_name': 'Roupas',
                'brand': 'Polo Style',
                'unit_of_measure': 'unidade',
                'supplier_name': 'Moda & Estilo',
                'purchase_cost': 25.00,
                'sale_price': 45.00,
                'current_stock': 50,
                'minimum_stock': 10,
                'maximum_stock': 100
            },
            {
                'name': 'Jeans Masculino',
                'description': 'Calça jeans masculina slim fit',
                'code': 'ROUPA002',
                'category_name': 'Roupas',
                'brand': 'Denim Co',
                'unit_of_measure': 'unidade',
                'supplier_name': 'Moda & Estilo',
                'purchase_cost': 40.00,
                'sale_price': 80.00,
                'current_stock': 2,  # Low stock
                'minimum_stock': 5,
                'maximum_stock': 50
            },
            {
                'name': 'Aspirador de Pó',
                'description': 'Aspirador de pó portátil 1200W',
                'code': 'CASA001',
                'category_name': 'Casa e Jardim',
                'brand': 'CleanMax',
                'unit_of_measure': 'unidade',
                'supplier_name': 'Casa Bella',
                'purchase_cost': 150.00,
                'sale_price': 250.00,
                'current_stock': 12,
                'minimum_stock': 5,
                'maximum_stock': 30
            }
        ]
        
        for prod_data in products_data:
            product = Product.query.filter_by(code=prod_data['code']).first()
            if not product:
                # Get category and supplier IDs
                category = Category.query.filter_by(name=prod_data['category_name']).first()
                supplier = Supplier.query.filter_by(name=prod_data['supplier_name']).first()
                
                if category and supplier:
                    product_dict = prod_data.copy()
                    product_dict['category_id'] = category.id
                    product_dict['supplier_id'] = supplier.id
                    del product_dict['category_name']
                    del product_dict['supplier_name']
                    
                    product = Product(**product_dict)
                    db.session.add(product)
                    print(f"✓ Product '{prod_data['name']}' created")
        
        # Create sample customer
        customer = Customer.query.filter_by(name='Cliente Padrão').first()
        if not customer:
            customer = Customer(
                name='Cliente Padrão',
                cpf_cnpj='123.456.789-00',
                phone='(11) 99999-0000',
                email='cliente@email.com',
                address='Rua do Cliente, 123 - São Paulo, SP'
            )
            db.session.add(customer)
            print("✓ Sample customer created")
        
        # Commit all changes
        db.session.commit()
        print("\n✅ Database seeded successfully!")
        print("\nLogin credentials:")
        print("Username: admin")
        print("Password: admin123")

if __name__ == '__main__':
    seed_database()

