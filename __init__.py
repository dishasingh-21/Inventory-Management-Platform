import os
from flask import Flask, render_template, request, jsonify
import db
import math
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
    
    with app.app_context():
        db.init_db()

    db.init_app(app)
    @app.route('/')
    def home():
        return render_template('index.html')
    
    #product_sales API
    @app.route('/api/product-sales/<product>')
    def product_sales(product):
        conn=db.get_db()
        data = conn.execute(
            '''
                SELECT quantity_sold, dates FROM sales WHERE product=? ORDER BY dates
            ''', (product,)
        ).fetchall()
        return jsonify([dict(row) for row in data])

    #API for fetching all product names
    @app.route('/api/products')
    def get_products():
        conn=db.get_db()
        data=conn.execute(
            'SELECT DISTINCT product FROM sales'
        ).fetchall()
        return jsonify([row['product'] for row in data])

    #API for ABC Analysis of finished goods
    @app.route('/api/abc-analysis/finished-goods')
    def abc_analysis_finishedGoods():
        conn=db.get_db()
        data=conn.execute(
            'SELECT * FROM finished_goods'
        ).fetchall()
        return jsonify([dict(row) for row in data])

    #API for ABC Analysis of raw_materials
    @app.route('/api/abc-analysis/raw_materials')
    def abc_analysis_rawMaterials():
        conn=db.get_db()
        data=conn.execute(
            'SELECT * FROM raw_materials'
        ).fetchall()
        return jsonify([dict(row) for row in data])
    
    #API for counting no. of products/raw_materials in each class along with their names
    @app.route('/api/abc-analysis-summary/<type>')
    def abc_analysis_summary(type):
        conn=db.get_db()
        table="finished_goods" if type=="finished_goods" else "raw_materials"
        category="product" if type=="finished_goods" else "raw_material"
        data=conn.execute(
            'SELECT class, {category}, COUNT(*) as count FROM {table} GROUP BY class'
        ).fetchall()
        result={}
        for row in data:
            Class=row['class']
            Name=row['{category}']
            if Class not in result:
                result[Class]={
                    "class":Class,
                    "items":[],
                    "count":0
                }
            result[Class]["items"].append(Name)
            result[Class]["count"]+=1
        return jsonify(list(result.values()))
    
    #API to fetch suitable data for plotting EPQ graph of each finished good
    @app.route('/api/data-for-plotting-EPQ-graph/<product>')
    def epq_data(product):
        conn=db.get_db()
        data=conn.execute(
            'SELECT demand_per_day, production_rate_per_day, time_to_produce_one_batch, Average_yearly_demand FROM finished_goods WHERE product=?', (product,)
        ).fetchone()
        return jsonify(dict(data))

    #API to calculate Economic Production Quantity of a finished_good
    @app.route('/api/EPQ/<product>')
    def economic_production_quantity(product):
        conn = db.get_db()
        data=conn.execute(
            'SELECT epq FROM finished_goods WHERE product=?',(product,)
        ).fetchone()
        epq=data["epq"]
        return jsonify({"EPQ":epq})

    #API to calculate reorder points of raw_materials
    @app.route("/api/reorder-point/<item>")
    def reorder_point(item):
        conn=db.get_db()
        data=conn.execute(
            'SELECT demand_per_day, lead_time,reorder_point FROM raw_materials WHERE raw_material=?',(item,)
        ).fetchall()
        d=data["demand_per_day"]
        l=data["lead_time"]
        rp=1.2*d*l
        if rp!=data["reorder_point"]:
            return data["reorder_point"]
        return rp

    return app

app=create_app()
# if __name__ == '__main__':
#     app.run(debug=True)



























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


