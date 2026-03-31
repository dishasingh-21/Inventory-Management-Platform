import os
from flask import Flask, render_template, request
from . import db
def create_app(test_config=None):
    app=Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'inventory.sqlite'),
    )
    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)

    return app
    
if __name__ == '__main__':
    create_app()



























# from flask import Flask,render_template,jsonify,request,g,current_app
# import sqlite3

# app = Flask(__name__)

# def get_db():
#     if 'conn' not in g:
#         g.conn = sqlite3.connect("database.db")
#         g.conn.row_factory=sqlite3.Row
#     return g.conn

# @app.teardown_appcontext
# def close_db(exception):
#     conn=g.pop('conn',None)
#     if conn is not None:
#         conn.close()

# @app.route("/")
# def home():
#     return render_template("index.html")

# @app.route("/dashboard")
# def dashboard():
#     return render_template("dashboard.html")

# if __name__ == "__main__":
#     app.run(debug=True)


