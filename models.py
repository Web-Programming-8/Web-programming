from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Post(db.Model):
    __tablename__ = "post"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


class Region(db.Model):
    __tablename__ = "region"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64), nullable=False, unique=True)
    code = db.Column(db.String(64), nullable=False, unique=True)
    cities = db.relationship("City", backref="region", lazy=True)


class City(db.Model):
    __tablename__ = "city"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64), nullable=False)
    code = db.Column(db.String(64), nullable=False, unique=True)
    region_id = db.Column(db.Integer, db.ForeignKey("region.id"), nullable=False)
