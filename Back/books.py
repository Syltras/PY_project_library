from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Model for the books Db
class Book(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    book_name = db.Column(db.String(100))
    book_author = db.Column(db.String(50))
    book_year = db.Column(db.String(10))
    book_type = db.Column(db.String(200))
    loans = db.relationship('Loan', backref='book', cascade='all, delete')

    def __init__(self, book_name, book_author, book_year, book_type):
        self.book_name = book_name
        self.book_author = book_author
        self.book_year = book_year
        self.book_type = book_type

    def to_dict(self):
        return {
            'id': self.id,
            'book_name': self.book_name,
            'book_author': self.book_author,
            'book_year': self.book_year,
            'book_type': self.book_type
        }

# Model for the customers Db
class Customer(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    cust_name = db.Column(db.String(100))
    cust_city = db.Column(db.String(50))
    cust_age = db.Column(db.Integer)
    loans = db.relationship('Loan', backref='customer', cascade='all, delete')

    def __init__(self, cust_name, cust_city, cust_age):
        self.cust_name = cust_name
        self.cust_city = cust_city
        self.cust_age = cust_age

    def to_dict(self):
        return {
            'id': self.id,
            'cust_name': self.cust_name,
            'cust_city': self.cust_city,
            'cust_age': self.cust_age
        }

# Model for the loans Db
class Loan(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    cust_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    loanDate = db.Column(db.String(20))
    returnDate = db.Column(db.String(20))

    def __init__(self, cust_id, book_id, loanDate, returnDate):
        self.cust_id = cust_id
        self.book_id = book_id
        self.loanDate = loanDate
        self.returnDate = returnDate

    def to_dict(self):
        return {
            'id': self.id,
            'cust_id': self.cust_id,
            'book_id': self.book_id,
            'loanDate': self.loanDate,
            'returnDate': self.returnDate
        }