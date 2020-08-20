from sqlalchemy import ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import sqlalchemy as db

Base = declarative_base()


class BlogUser(Base):
    __tablename__ = 'BLOGUSERS'
    id = db.Column(db.Integer, primary_key=True)
    uname = db.Column(db.String(20))
    name = db.Column(db.String(40))
    password = db.Column(db.String(30))

    posts = relationship("BlogPost", back_populates='user',
                         cascade="all, delete, delete-orphan")


class BlogPost(Base):
    __tablename__ = 'BLOGPOSTS'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    post = db.Column(db.String(500))
    user_id = db.Column(db.Integer, ForeignKey('BLOGUSERS.id'))

    user = relationship("BlogUser", back_populates="posts")
