from flask import Flask,render_template,jsonify,request,g,current_app
import sqlite3

app = Flask(__name__)

def get_db():
    if 'conn' not in g:
        g.conn = sqlite3.connect("database.db")
        g.conn.row_factory=sqlite3.Row
    return g.conn

@app.teardown_appcontext
def close_db(exception):
    conn=g.pop('conn',None)
    if conn is not None:
        conn.close()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)


