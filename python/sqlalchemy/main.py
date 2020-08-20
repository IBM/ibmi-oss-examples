from flask import Flask, render_template, request, url_for, redirect
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker

from db import Base, BlogUser, BlogPost

app = Flask(__name__)

engine = sa.create_engine("ibmi://*CURRENT@localhost/")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
current_user = None


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/create_user', methods=['POST'])
def create_user():
    new_user = BlogUser(
        uname=request.form.get('uname'),
        name=request.form.get('name'),
        password=request.form.get('pwd'))

    try:
        session.add(new_user)
        session.commit()
    except:
        session.rollback()
        raise
    return render_template('login.html')


@app.route('/gotologin')
def gotologin():
    return render_template('login.html')


@app.route('/create_post', methods=['POST'])
def create_post():
    if not current_user:
        return redirect(url_for('gotologin'))
    new_post = BlogPost(
        title=request.form.get('title'),
        post=request.form.get('post')
    )
    try:
        session.add(new_post)
        current_user.posts.append(new_post)
        session.commit()
    except:
        session.rollback()
        raise
    return redirect(url_for('posts'))


@app.route('/posts')
def posts():
    if not current_user:
        return redirect(url_for('gotologin'))
    titles = []
    authors = []
    blog_posts = []
    for result in session.query(BlogPost).all():
        titles.append(result.title)
        authors.append(result.user.name)
        blog_posts.append(result.post)

    return render_template('posts.html', titles=titles, authors=authors,
                           blog_posts=blog_posts)


@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('uname')
    password = request.form.get('pwd')
    user = session.query(BlogUser).filter_by(uname=username).one()
    if user:
        if user.password == password:
            global current_user
            current_user = user
            return redirect(url_for('posts'))

    return render_template('login.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
