from flask import (
    Flask,
    request,
    render_template,
    make_response,
    redirect,
    url_for,
    flash,
    abort,
    send_from_directory,
)
from models import db, Post, Region, City
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from PIL import Image
import os, json


app = Flask(__name__)
app.secret_key = os.urandom(24)


def insert_region_data():
    with open("regions.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    if "광역시" in data:
        for city in data["광역시"]:
            region_name = city["name"]
            region_code = city["code"]

            # Region 추가
            region = Region.query.filter_by(name=region_name).first()
            if not region:
                region = Region(name=region_name, code=region_code)
                db.session.add(region)
                db.session.commit()

    for region_name, region_data in data.items():
        if region_name == "광역시":
            continue
        region_code = region_data["code"]
        cities = region_data["cities"]
        region = Region.query.filter_by(name=region_name).first()
        if not region:
            region = Region(name=region_name, code=region_code)
            db.session.add(region)
            db.session.commit()

        for city in cities:
            city_name = city["name"]
            city_code = city["code"]

            existing_city = City.query.filter_by(
                name=city_name, region_id=region.id
            ).first()
            if not existing_city:
                new_city = City(name=city_name, code=city_code, region_id=region.id)
                db.session.add(new_city)

    db.session.commit()


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static", "images"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/roulette")
def roulette():
    return render_template("roulette.html")


@app.route("/random")
def random():
    return render_template("random.html")


@app.route("/city/<city_name>")
def city(city_name):
    try:
        return render_template(f"city/{city_name}.html")
    except Exception:
        abort(404)


@app.route("/post")
def post():
    sort = request.args.get("sort", "latest")
    if sort == "likes":
        posts = Post.query.order_by(Post.likes.desc()).all()
    else:
        posts = Post.query.order_by(Post.created_at.desc()).all()
    return render_template("post.html", posts=posts, sort=sort)


@app.route("/add_post", methods=["POST"])
def add_post():
    username = request.form["username"]
    content = request.form["content"]
    password = request.form["password"]
    image = request.files["image"]
    image_url = None

    if image and image.filename:
        filename = secure_filename(image.filename)
        save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        image_file = Image.open(image)
        image_file = image_file.convert("RGB")
        image_file.save(save_path, format="JPEG", quality=85)

        image_url = os.path.join("uploads", filename)

    hashed_password = generate_password_hash(password)
    new_post = Post(
        username=username,
        content=content,
        password=hashed_password,
        image_url=image_url,
    )
    db.session.add(new_post)
    db.session.commit()
    return redirect(url_for("post"))


@app.route("/delete_post/<int:post_id>", methods=["POST"])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    password = request.form["password"]

    if check_password_hash(post.password, password):
        if post.image_url:
            image_path = os.path.join(
                app.config["UPLOAD_FOLDER"], os.path.basename(post.image_url)
            )
            if os.path.exists(image_path):
                os.remove(image_path)

        db.session.delete(post)
        db.session.commit()
        flash("게시물이 삭제되었습니다.")
    else:
        flash("비밀번호가 일치하지 않습니다.")
    return redirect(url_for("post"))


@app.route("/like_post/<int:post_id>", methods=["POST"])
def like_post(post_id):
    post = Post.query.get(post_id)
    if post:
        post.likes += 1
        db.session.commit()
        return {"success": True, "likes": post.likes}
    return {"success": False}, 400


if __name__ == "__main__":
    basedir = os.path.abspath(os.path.dirname(__file__))
    dbfile = os.path.join(basedir, "db.sqlite")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + dbfile
    app.config["UPLOAD_FOLDER"] = "static/uploads"
    app.config["SQLALCHEMY_COMMIT_ON_TEARDOWN"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    db.init_app(app)
    with app.app_context():
        db.create_all()
        insert_region_data()
    app.run(host="0.0.0.0", port=5000, debug=True)
