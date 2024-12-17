from flask import Flask, request, g
import sqlite3
from pathlib import Path
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def index():
    return "<h1>Funds Tracker API</h1>"

@app.route("/api/docs")
def api_docs():
    return "<h3>API Documentation</h3>"



#   --> Configurations <--

def open_db():
    dbFile = Path('static/fundstracker.db')
    con = sqlite3.connect(str(dbFile))

    return con


@app.route("/config/income", methods = ['GET', 'POST'])
def incomeConfig():
    mode = request.method # get request method

    if(mode == 'POST'):
        content = request.get_json() # get request data

        name = content.get('name','')
        desc = content.get('description','')

        # validate for nulls 
        if(name == '' or desc == ''):
            return 'Bad Request: Missing required fields.', 400

        # create required variables
        now = datetime.now().strftime("%Y-%m-%d")
        details = ( name, desc, 'active', now)

        # open db connection, insert data and get the record
        dbCon = open_db();
        sql = "INSERT INTO incometypes(name,description,status,datecreated) VALUES(?,?,?,?)"
        cur = dbCon.cursor().execute(sql, details)
        dbCon.commit()

        cur.execute(f"SELECT * FROM incometypes WHERE id = {cur.lastrowid}")
        record = cur.fetchall()

        # close db connection
        dbCon.close()

        return record, 200

    elif(mode == 'GET'):
        # open db connection
        dbCon = open_db();
        response = None

        # retrive the data
        with dbCon:
            cur = dbCon.cursor()
            try:
                cur.execute("SELECT * FROM incometypes")
                rows = cur.fetchall()

                response = rows
            except Exception as ex:
                return f'Internal Server Error: {ex.args}', 500
        
        # close db connection
        dbCon.close();

        return response, 200

    else:
        return f'Un-implemented request method: {mode}'


@app.route("/config/expense", methods = ['GET', 'POST'])
def expenseConfig():
    mode = request.method # get request method

    if(mode == 'POST'):
        content = request.get_json() # get request data

        name = content.get('name','')
        desc = content.get('description','')

        # validate for nulls 
        if(name == '' or desc == ''):
            return 'Bad Request: Missing required fields.', 400

        # create required variables
        now = datetime.now().strftime("%Y-%m-%d")
        details = ( name, desc, 'active', now)

        # open db connection, insert data and get the record
        dbCon = open_db();
        sql = "INSERT INTO expensetypes(name,description,status,datecreated) VALUES(?,?,?,?)"
        cur = dbCon.cursor().execute(sql, details)
        dbCon.commit()

        cur.execute(f"SELECT * FROM expensetypes WHERE id = {cur.lastrowid}")
        record = cur.fetchall()

        # close db connection
        dbCon.close()

        return record, 200

    elif(mode == 'GET'):
        # open db connection
        dbCon = open_db();
        response = None

        # retrive the data
        with dbCon:
            cur = dbCon.cursor()
            try:
                cur.execute("SELECT * FROM expensetypes")
                rows = cur.fetchall()

                response = rows
            except Exception as ex:
                return f'Internal Server Error: {ex.args}', 500
        
        # close db connection
        dbCon.close();

        return response, 200

    else:
        return f'Un-implemented request method: {mode}'


