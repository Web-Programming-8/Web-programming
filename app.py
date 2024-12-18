from flask import (
    Flask,
    request,
    render_template,
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


@app.route("/search")
def search():
    query = request.args.get("query", "").strip()
    search_results = []  # 일반 검색 결과 (광역시, 도시)
    regions_with_cities = []  # 도와 그에 속한 도시 목록을 저장

    if query:
        # 명확한 광역시/특별시 예외 처리
        redirect_cities = {
            "서울": "seoul",
            "부산": "busan",
            "대구": "daegu",
            "인천": "incheon",
            "대전": "daejeon",
            "울산": "ulsan",
            "세종": "sejong",
            "세종시": "sejong",
        }

        # 특정 광역시 검색 시 바로 리다이렉트
        for key, code in redirect_cities.items():
            if key == query:  # 정확히 일치해야 리다이렉트
                return redirect(f"/city/{code}")

        # 광주 검색 시 광주광역시와 경기도 광주시 모두 표시
        if query == "광주":
            regions = Region.query.filter(Region.name.contains("광주")).all()
            for region in regions:
                search_results.append(
                    {"name": region.name, "code": region.code, "type": "region"}
                )

            cities = City.query.filter(City.name.contains("광주")).all()
            for city in cities:
                search_results.append(
                    {"name": city.name, "code": city.code, "type": "city"}
                )

        # 제주도 예외 처리
        elif query in ["제주", "제주도", "제주특별자치도"]:
            jeju_region = Region.query.filter_by(name="제주특별자치도").first()
            if jeju_region:
                cities_in_region = City.query.filter_by(region_id=jeju_region.id).all()
                regions_with_cities.append(
                    {"region_name": jeju_region.name, "cities": cities_in_region}
                )

        # 경상, 충청, 전라 + 도 처리
        elif query in ["경상", "경상도", "충청", "충청도", "전라", "전라도"]:
            region_keywords = {
                "경상": ["경상북도", "경상남도"],
                "경상도": ["경상북도", "경상남도"],
                "충청": ["충청북도", "충청남도"],
                "충청도": ["충청북도", "충청남도"],
                "전라": ["전라북도", "전라남도"],
                "전라도": ["전라북도", "전라남도"],
            }

            for region_name in region_keywords[query]:
                region = Region.query.filter_by(name=region_name).first()
                if region:
                    cities_in_region = City.query.filter_by(region_id=region.id).all()
                    regions_with_cities.append(
                        {"region_name": region.name, "cities": cities_in_region}
                    )

        # 남/북도 이름 정확히 입력 시 도시 목록 표시
        elif query in [
            "전라북도",
            "전라남도",
            "경상북도",
            "경상남도",
            "충청북도",
            "충청남도",
        ]:
            region = Region.query.filter_by(name=query).first()
            if region:
                cities_in_region = City.query.filter_by(region_id=region.id).all()
                regions_with_cities.append(
                    {"region_name": region.name, "cities": cities_in_region}
                )

        # 경기도, 강원도
        elif query in ["경기도", "강원도"]:
            region = Region.query.filter_by(name=query).first()
            if region:
                cities_in_region = City.query.filter_by(region_id=region.id).all()
                regions_with_cities.append(
                    {"region_name": region.name, "cities": cities_in_region}
                )

        # 일반 검색 결과 처리
        else:
            regions = Region.query.filter(Region.name.contains(query)).all()
            cities = City.query.filter(City.name.contains(query)).all()

            for region in regions:
                search_results.append(
                    {"name": region.name, "code": region.code, "type": "region"}
                )

            for city in cities:
                search_results.append(
                    {"name": city.name, "code": city.code, "type": "city"}
                )

    return render_template(
        "search.html",
        results=search_results,
        query=query,
        regions_with_cities=regions_with_cities,
    )


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
        return '<script>alert("게시물이 삭제되었습니다."); window.location.href="/post"</script>'
    else:
        return '<script>alert("비밀번호가 일치하지 않습니다."); history.go(-1)</script>'


@app.route("/like_post/<int:post_id>", methods=["POST"])
def like_post(post_id):
    post = db.session.get(Post, post_id)
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
    app.run(host="0.0.0.0", port=4000, debug=True)
