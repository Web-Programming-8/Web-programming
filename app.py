from flask import Flask, request, render_template, make_response, redirect

# from models import db, Kuser, Board
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
