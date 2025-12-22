from flask import Flask, request
from flask_cors import CORS
import sqlite3
import math
from pathlib import Path
from datetime import datetime

app = Flask(__name__)
CORS(app) # enable cors for all routes

@app.route("/")
def index():
    return "<h1>Funds Tracker API</h1>"

@app.route("/api/docs")
def api_docs():
    return "<h3>API Documentation</h3>"

@app.route("/api/auth/login", methods= ['POST'])
def authLogin():
    content = request.get_json() # get request data

    uname = content.get('uname','')
    pwd = content.get('pwd','')

    # validate for nulls 
    if(uname == '' or pwd == ''):
        return 'Bad Request: Missing required fields.', 400
    
    if(pwd != 'Desslynn2026!'):
        return 'Invalid credentials.', 401
    
    response = {
        'username': uname
    }

    return response, 200


#   --> Required Methods <--

def open_db():
    # dbFile = Path('static/fundstracker.db') # dev env
    dbFile = Path('static/myfundstracker.db') # pdn env
    con = sqlite3.connect(str(dbFile))

    return con

def getIncomeTypeByRef(ref):
    # open db connection, insert data and get the record
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row

    cur = dbCon.cursor().execute(f"SELECT * FROM incometypes WHERE id = {ref}")
    recs = cur.fetchall()
    record = dict(recs[0]) if recs.__len__() > 0 else []

    # close db connection
    dbCon.close()

    return record

def getExpenseTypeByRef(ref):
    # open db connection, insert data and get the record
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row

    cur = dbCon.cursor().execute(f"SELECT * FROM expensetypes WHERE id = {ref}")
    recs = cur.fetchall()
    record = dict(recs[0]) if recs.__len__() > 0 else []

    # close db connection
    dbCon.close()

    return record


#   --> Configurations <--

@app.route("/config/income", methods = ['GET', 'POST','PUT'])
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
        dbCon.row_factory = sqlite3.Row
        sql = "INSERT INTO incometypes(name,description,status,datecreated) VALUES(?,?,?,?)"
        cur = dbCon.cursor().execute(sql, details)
        dbCon.commit()

        cur.execute(f"SELECT * FROM incometypes WHERE id = {cur.lastrowid}")
        recs = cur.fetchall()
        record = dict(recs[0])

        # close db connection
        dbCon.close()

        return record, 200

    elif(mode == 'GET'):
        # open db connection
        dbCon = open_db();
        dbCon.row_factory = sqlite3.Row
        response = None

        # retrive the data
        with dbCon:
            cur = dbCon.cursor()
            try:
                cur.execute("SELECT * FROM incometypes WHERE status = 'active'")
                rows = cur.fetchall()

                response = [dict(r) for r in rows]
            except Exception as ex:
                return f'Internal Server Error: {ex.args}', 500
        
        # close db connection
        dbCon.close();

        return response, 200

    elif(mode == 'PUT'):
        content = request.get_json() # get request data

        ref = content.get('id','')
        name = content.get('name','')
        desc = content.get('description','')

        # validate for nulls 
        if(ref == '' or name == '' or desc == ''):
            return 'Bad Request: Missing required fields.', 400

        # create required variables
        details = ( name, desc, ref)

        # open db connection, insert data and get the record
        dbCon = open_db();
        dbCon.row_factory = sqlite3.Row
        sql = "UPDATE incometypes SET name = ?,description = ? WHERE id = ?"
        cur = dbCon.cursor().execute(sql, details)
        dbCon.commit()

        cur.execute(f"SELECT * FROM incometypes WHERE id = {ref}")
        recs = cur.fetchall()
        record = dict(recs[0])

        # close db connection
        dbCon.close()

        return record, 200

    else:
        return f'Un-implemented request method: {mode}', 405

@app.route("/config/income/<int:ref>", methods = ['GET'])
def incomeTyp(ref):
    # validate for nulls 
    if(ref == ''):
        return 'Bad Request: Missing required fields.', 400
    
    # get the typ
    record = getIncomeTypeByRef(ref);
    

    return record, 200

@app.route("/config/income/delete/<int:ref>", methods = ['DELETE'])
def deleteIncomeTyp(ref):
    # validate for nulls 
    if(ref == ''):
        return 'Bad Request: Missing required fields.', 400
    
    # open db connection, insert data and get the record
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    sql = f"UPDATE incometypes SET status = 'deleted' WHERE id = {ref}"
    dbCon.cursor().execute(sql)
    dbCon.commit()

    return 'Income Type Deleted', 200

@app.route("/config/expense", methods = ['GET', 'POST','PUT'])
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
        dbCon.row_factory = sqlite3.Row
        sql = "INSERT INTO expensetypes(name,description,status,datecreated) VALUES(?,?,?,?)"
        cur = dbCon.cursor().execute(sql, details)
        dbCon.commit()

        cur.execute(f"SELECT * FROM expensetypes WHERE id = {cur.lastrowid}")
        recs = cur.fetchall()
        record = dict(recs[0])

        # close db connection
        dbCon.close()

        return record, 200

    elif(mode == 'GET'):
        # open db connection
        dbCon = open_db();
        dbCon.row_factory = sqlite3.Row
        response = None

        # retrive the data
        with dbCon:
            cur = dbCon.cursor()
            try:
                cur.execute("SELECT * FROM expensetypes WHERE status = 'active'")
                rows = cur.fetchall()

                response = [dict(r) for r in rows]
            except Exception as ex:
                return f'Internal Server Error: {ex.args}', 500
        
        # close db connection
        dbCon.close();

        return response, 200

    elif(mode == 'PUT'):
        content = request.get_json() # get request data

        ref = content.get('id','')
        name = content.get('name','')
        desc = content.get('description','')

        # validate for nulls 
        if(ref == '' or name == '' or desc == ''):
            return 'Bad Request: Missing required fields.', 400

        # create required variables
        details = ( name, desc, ref)

        # open db connection, insert data and get the record
        dbCon = open_db();
        dbCon.row_factory = sqlite3.Row
        sql = "UPDATE expensetypes SET name = ?,description = ? WHERE id = ?"
        cur = dbCon.cursor().execute(sql, details)
        dbCon.commit()

        cur.execute(f"SELECT * FROM expensetypes WHERE id = {ref}")
        recs = cur.fetchall()
        record = dict(recs[0])

        # close db connection
        dbCon.close()

        return record, 200

    else:
        return f'Un-implemented request method: {mode}', 405

@app.route("/config/expense/<int:ref>", methods = ['GET'])
def expenseTyp(ref):
    # validate for nulls 
    if(ref == ''):
        return 'Bad Request: Missing required fields.', 400
    
    # get the typ
    record = getExpenseTypeByRef(ref);
    

    return record, 200

@app.route("/config/expense/delete/<int:ref>", methods = ['DELETE'])
def deleteExpenseTyp(ref):
    # validate for nulls 
    if(ref == ''):
        return 'Bad Request: Missing required fields.', 400
    
    # open db connection, insert data and get the record
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    sql = f"UPDATE expensetypes SET status = 'deleted' WHERE id = {ref}"
    dbCon.cursor().execute(sql)
    dbCon.commit()

    return 'Expense Type Deleted', 200

#   --> acount transactions <--

@app.route("/account/transact", methods = ['POST'])
def accountTransact():
    content = request.get_json() # get request data

    typ = content.get('type','')
    typref = content.get('typeref','')
    amount = content.get('amount','')
    currency = content.get('currency','')
    user = content.get('user','')

    # validate for nulls 
    if(typ == '' or typref == '' or amount == '' or currency == '' or user == ''):
        return 'Bad Request: Missing required fields.', 400
    
    # validate type ref
    theTyp = getIncomeTypeByRef(typref) if (typ == 'IN') else getExpenseTypeByRef(typref)
    if(theTyp.__len__() == 0):
        return 'Bad Request: Type Ref invalid: ' + str(typref), 400

    # create required variables
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    details = ( typ, typref, amount, 'active', now, user, currency)

    # open db connection, insert data and get the record
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    sql = "INSERT INTO accountledger(type,typeref,amount,status,datecreated,modifiedby,currency) VALUES(?,?,?,?,?,?,?)"
    cur = dbCon.cursor().execute(sql, details)
    dbCon.commit()
    recRef = cur.lastrowid

    # alter balances accordingly
    theAmount = amount if (typ == 'IN') else (int(amount) * -1)
    query = f"UPDATE accountbal SET balance = balance + {theAmount}, lastledgerref = {recRef} WHERE currency = '{currency}'"
    print(query)
    cur = dbCon.cursor().execute(query)
    dbCon.commit()

    # get the inserted record and return as response
    cur.execute(f"SELECT * FROM accountledger WHERE id = {recRef}")
    recs = cur.fetchall()
    record = dict(recs[0])

    # close db connection
    dbCon.close()

    return record, 200

@app.route("/transactions/all/<int:page>/<int:size>", methods = ['GET'])
def allTransactions(page, size):
    # open db connection
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    response = None
    totalItems = None

    offset = (page * size);

    # retrive the data
    with dbCon:
        cur = dbCon.cursor()
        try:

            cur.execute(f"SELECT count(*) FROM accountledger")
            totalItems = cur.fetchone()[0]
        
            cur.execute(f"SELECT * FROM accountledger ORDER BY datecreated DESC LIMIT {size} OFFSET {offset}")
            rows = cur.fetchall()

            response = {
                'page': page,
                'size': size,
                'data': [dict(r) for r in rows],
                'total_items': totalItems,
                'total_pages': math.ceil((totalItems / size))
            }
        except Exception as ex:
            return f'Internal Server Error: {ex.args}', 500
    
    # close db connection
    dbCon.close();

    return response, 200

@app.route("/transactions/by-type/<string:typ>/<int:page>/<int:size>", methods = ['GET'])
def allTransactionsByType(typ, page, size):
    # open db connection
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    response = None
    totalItems = None

    offset = (page * size);

    # retrive the data
    with dbCon:
        cur = dbCon.cursor()
        try:
            cur.execute(f"SELECT count(*) FROM accountledger WHERE type='{typ}'")
            totalItems = cur.fetchone()[0]

            cur.execute(f"SELECT * FROM accountledger WHERE type='{typ}' ORDER BY datecreated DESC LIMIT {size} OFFSET {offset}")
            rows = cur.fetchall()

            esponse = {
                'page': page,
                'size': size,
                'data': [dict(r) for r in rows],
                'total_items': totalItems,
                'total_pages': math.ceil((totalItems / size))
            }
        except Exception as ex:
            return f'Internal Server Error: {ex.args}', 500
    
    # close db connection
    dbCon.close();

    return response, 200

@app.route("/transactions/by-currency/<string:curr>/<int:page>/<int:size>", methods = ['GET'])
def allTransactionsByCurrency(curr, page, size):
    # open db connection
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    response = None
    totalItems = None

    offset = (page * size);

    # retrive the data
    with dbCon:
        cur = dbCon.cursor()
        try:
            cur.execute(f"SELECT count(*) FROM accountledger WHERE currency='{curr}'")
            totalItems = cur.fetchone()[0]

            cur.execute(f"SELECT * FROM accountledger WHERE currency='{curr}' ORDER BY datecreated DESC LIMIT {size} OFFSET {offset}")
            rows = cur.fetchall()

            esponse = {
                'page': page,
                'size': size,
                'data': [dict(r) for r in rows],
                'total_items': totalItems,
                'total_pages': math.ceil((totalItems / size))
            }
        except Exception as ex:
            return f'Internal Server Error: {ex.args}', 500
    
    # close db connection
    dbCon.close();

    return response, 200

@app.route("/transactions/by-ref/<string:typ>/<int:ref>", methods = ['GET'])
def getTransactionDetail(typ, ref):
    # open db connection
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    response = None

    # retrive the data
    with dbCon:
        cur = dbCon.cursor()
        try:
            if(typ == 'IN'):
                cur.execute(f"SELECT accountledger.id, accountledger.datecreated, TYPE, name, description, currency, amount, modifiedby " + 
                            "FROM accountledger LEFT JOIN incometypes ON accountledger.typeref = incometypes.id " +
                            "WHERE accountledger.id = " + str(ref))
            else:
                cur.execute(f"SELECT a.id, a.datecreated, TYPE, name, description, currency, amount, modifiedby " + 
                            "FROM accountledger as a LEFT JOIN expensetypes as b ON a.typeref = b.id " +
                            "WHERE a.id = " + str(ref))
            
            rows = cur.fetchall()

            response = [dict(r) for r in rows]
        except Exception as ex:
            return f'Internal Server Error: {ex.args}', 500
    
    # close db connection
    dbCon.close();

    return response, 200


@app.route("/account/balances", methods = ['GET'])
def accountBalances():
    # open db connection
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    response = None

    # retrive the data
    with dbCon:
        cur = dbCon.cursor()
        try:
            cur.execute(f"SELECT * FROM accountbal")
            rows = cur.fetchall()

            response = [dict(r) for r in rows]
        except Exception as ex:
            return f'Internal Server Error: {ex.args}', 500
    
    # close db connection
    dbCon.close();

    return response, 200

#   --> reports & statistics <--

@app.route("/configs/statistics", methods = ['GET'])
def configsStatistics():
    # open db connection
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    response = None

    # retrive the data
    with dbCon:
        cur = dbCon.cursor()
        try:
            cur.execute(f"SELECT " +
                    "(SELECT COUNT(*) FROM incometypes WHERE status = 'active') AS incometypes," +
                    "(SELECT COUNT(*) FROM expensetypes WHERE status = 'active') AS expensetypes")
            rows = cur.fetchall()

            response = [dict(r) for r in rows]
        except Exception as ex:
            return f'Internal Server Error: {ex.args}', 500
    
    # close db connection
    dbCon.close();

    return response, 200

@app.route("/transactions/statistics", methods = ['GET'])
def tranStatistics():
    # open db connection
    dbCon = open_db();
    dbCon.row_factory = sqlite3.Row
    response = None

    # retrive the data
    with dbCon:
        cur = dbCon.cursor()
        try:
            cur.execute(f"SELECT MAX(amount) AS amt, currency, e.name FROM accountledger " +
                        "LEFT JOIN expensetypes e ON accountledger.typeref = e.id " +
                        "WHERE accountledger.TYPE = 'EX' AND STRFTIME('%Y-%m', accountledger.datecreated) = STRFTIME('%Y-%m', DATE()) GROUP BY currency")
            rows = cur.fetchall()

            resp1 = [dict(r) for r in rows]

            cur.execute(f"SELECT accountledger.TYPE, sum(amount) AS amt, currency FROM accountledger WHERE STRFTIME('%Y-%m', datecreated) = STRFTIME('%Y-%m', DATE()) GROUP BY accountledger.TYPE, currency")
            rows = cur.fetchall()

            resp2 = [dict(r) for r in rows]

            response = {
                'expenses': resp1,
                'totals': resp2
            }

        except Exception as ex:
            return f'Internal Server Error: {ex.args}', 500
    
    # close db connection
    dbCon.close();

    return response, 200


