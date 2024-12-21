CREATE TABLE "accountbal" (
	"id" INTEGER NOT NULL,
	"balance" REAL NOT NULL,
	"datemodified" DATETIME NOT NULL,
	"modifiedby" VARCHAR(50) NOT NULL,
	"lastledgerref" INTEGER NOT NULL,
	"currency" CHAR(3) NOT NULL,
	PRIMARY KEY ("id")
)
;

CREATE TABLE "accountledger" (
	"id" INTEGER NOT NULL,
	"type" VARCHAR(50) NOT NULL,
	"typeref" INTEGER NOT NULL,
	"amount" REAL NOT NULL,
	"status" VARCHAR(50) NOT NULL,
	"datecreated" DATETIME NOT NULL,
	"modifiedby" VARCHAR(50) NOT NULL,
	"currency" CHAR(3) NOT NULL,
	PRIMARY KEY ("id")
)
;

CREATE TABLE "expensetypes" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	"status" VARCHAR(50) NOT NULL,
	"description" VARCHAR(250) NULL,
	"datecreated" DATE NULL,
	PRIMARY KEY ("id")
)
;

CREATE TABLE "incometypes" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	"status" VARCHAR(50) NOT NULL,
	"description" VARCHAR(250) NULL,
	"datecreated" DATE NULL,
	PRIMARY KEY ("id")
)
;


INSERT INTO "accountbal" ("id", "balance", "datemodified", "modifiedby", "lastledgerref", "currency") VALUES (2, 0.0, '2024-12-18 12:51:35', 'root', 0, 'ZWG');
INSERT INTO "accountbal" ("id", "balance", "datemodified", "modifiedby", "lastledgerref", "currency") VALUES (1, 0.0, '2024-12-18 12:24:04', 'root', 0, 'USD');

