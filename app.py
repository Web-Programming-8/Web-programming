from flask import (
    Flask,
    request,
    render_template,
    make_response,
    redirect,
    url_for,
    flash,
)
from models import db, Comment
from werkzeug.security import generate_password_hash, check_password_hash
import os


app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/roulette")
def roulette():
    return render_template("roulette.html")


@app.route(
    "/seoul"
)  # 나중에는 데이터베이스나 문자열 이런거 받아서 그쪽으로 넘겨줄 예정
def destination():
    return render_template("seoul.html")


@app.route("/comment")
def comment():
    comments = Comment.query.order_by(Comment.created_at.desc()).all()
    return render_template("test.html", comments=comments)


@app.route("/add_comment", methods=["POST"])
def add_comment():
    username = request.form["username"]
    password = request.form["password"]
    content = request.form["content"]

    if not username or not password or not content:
        flash("모든 칸을 채워주세요.")
        return redirect(url_for("comment"))

    hashed_password = generate_password_hash(password)
    new_comment = Comment(username=username, password=hashed_password, content=content)
    db.session.add(new_comment)
    db.session.commit()
    flash("댓글이 추가되었습니다.")
    return redirect(url_for("comment"))


@app.route("/delete_comment/<int:comment_id>", methods=["POST"])
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    password = request.form["password"]

    if check_password_hash(comment.password, password):
        db.session.delete(comment)
        db.session.commit()
        flash("댓글이 삭제되었습니다.")
    else:
        flash("비밀번호가 일치하지 않습니다.")
    return redirect(url_for("comment"))


if __name__ == "__main__":
    basedir = os.path.abspath(os.path.dirname(__file__))
    dbfile = os.path.join(basedir, "db.sqlite")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + dbfile
    app.config["SQLALCHEMY_COMMIT_ON_TEARDOWN"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)
