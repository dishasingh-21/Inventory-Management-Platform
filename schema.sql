DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS finished_goods;
DROP TABLE IF EXISTS raw_materials;
DROP TABLE IF EXISTS product_material_map;

CREATE TABLE sales(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    quantity_sold INTEGER NOT NULL,
    dates TEXT NOT NULL
);
CREATE TABLE finished_goods(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT UNIQUE NOT NULL,
    volume_sold_over_years INTEGER NOT NULL,
    unit_cost REAL,
    dollar_volume REAL,
    dollar_volume_percentage REAL,
    cumulative_percentage_dollar_volume REAL,
    demand_per_day REAL,
    batch_size INTEGER,
    time_to_produce_one_batch INTEGER,
    production_rate_per_day REAL,
    Average_yearly_demand REAL,
    setup_cost REAL,
    holding_cost REAL,
    class TEXT NOT NULL
);
CREATE TABLE raw_materials(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_material TEXT UNIQUE NOT NULL,
    cost_per_gm REAL NOT NULL,
    lead_time INTEGER NOT NULL,
    reorder_point REAL NOT NULL,
    demand_per_day REAL NOT NULL,
    annual_demand REAL NOT NULL,
    annual_comsumption_value REAL NOT NULL,
    consumption_percentage REAL NOT NULL,
    cumulative_percentage_consumption REAL NOT NULL,
    class TEXT NOT NULL
);
CREATE TABLE product_material_map(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    whey_protien_isolate INTEGER NOT NULL,
    plant_protein_powder INTEGER NOT NULL,
    oats INTEGER NOT NULL,
    almond_flour INTEGER NOT NULL,
    cocoa_powder INTEGER NOT NULL,
    dates_paste INTEGER NOT NULL,
    chia_seeds INTEGER NOT NULL,
    vitamin_premix INTEGER NOT NULL,
    natural_sweeteners INTEGER NOT NULL,
    FOREIGN KEY (id) REFERENCES finished_goods(id)
);