import sqlite3
from datetime import datetime
import os,csv
import click
from flask import current_app, g

def get_db():
    if 'db' not in g:
        g.db=sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory=sqlite3.Row

    return g.db

def close_db(e=None):
    db=g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db=get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    
    with open('project/data/sales.csv', newline='',encoding='utf-8') as f:
        db=get_db()
        reader=csv.reader(f)
        columns=next(reader)
        placeholders=','.join('?'*len(columns))
        for row in reader:
            db.execute(
                f'INSERT INTO sales ({','.join(columns)}) VALUES ({placeholders})', row
            )
            db.commit()

    with open('project/data/finished_goods.csv', newline='', encoding='utf-8') as f:
        db=get_db()
        reader=csv.reader(f)
        columns=next(reader)
        placeholders=','.join('?'*len(columns))
        for row in reader:
            db.execute(
                f'INSERT INTO finished_goods ({','.join(columns)}) VALUES ({placeholders})', row
            )
            db.commit()
    
    with open('project/data/raw_materials.csv', newline='', encoding='utf-8') as f:
        db=get_db()
        reader=csv.reader(f)
        columns=next(reader)
        placeholders=','.join('?'*len(columns))
        for row in reader:
            db.execute(
                f'INSERT INTO raw_materials ({','.join(columns)}) VALUES ({placeholders})', row
            )
            db.commit()

    with open('project/data/product_material_map.csv', newline='', encoding='utf-8') as f:
        db=get_db()
        reader=csv.reader(f)
        columns=next(reader)
        placeholders=','.join('?'*len(columns))
        for row in reader:
            db.execute(
                f'INSERT INTO product_material_map ({','.join(columns)}) VALUES ({placeholders})', row
            )
            db.commit()
    print('database populated successfully.')

@click.command('init-db')
def init_db_command():
    init_db()
    click.echo('initialized the database.')

sqlite3.register_converter(
    "timestamp", lambda v:datetime.fromisoformat(v.decode())
)
def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
