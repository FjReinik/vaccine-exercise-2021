"use strict";
//tämän kääntmäistä typescriptiksi ei koettu tarpeelliseksi.
Object.defineProperty(exports, "__esModule", { value: true });
var knexfile_1 = require("./knexfile");
var connection = knexfile_1.Connect();
const fs = require('fs');
const { parse } = require("path");
const { connect } = require("http2");
var antiqua = ""
var solarBuddhica = ""
var zerpfy = ""
var vaccinations = ""

//Knex should handle errors, so try - catch seems irrelevant
connection.raw(`
    CREATE TABLE vaccine_order (
        id varchar(40),
        "healthCareDistrict" varchar(4),
        "orderNumber" smallint,
        "responsiblePerson" varchar(60),
        injections smallint,
        arrived timestamp,
        vaccine varchar(20)
    );
    
    CREATE TABLE vaccine_event (
        "vaccination-id" varchar(40),
        "sourceBottle" varchar(40),
        gender varchar(10),
        "vaccinationDate" timestamp
    );
`)
    .then(() => {
        console.log("Table creation - OK")
    })
    .catch((err) => {
        console.log(err)
    })


    antiqua = fs.readFileSync("../resources/Antiqua.source", "utf8")
    zerpfy = fs.readFileSync("../resources/Zerpfy.source", "utf8")
    solarBuddhica = fs.readFileSync("../resources/SolarBuddhica.source", "utf8")
    vaccinations = fs.readFileSync("../resources/vaccinations.source", "utf8")


    const allOrders = (zerpfy + solarBuddhica + antiqua).trim().split("\n")
    const allOrdersParsed = allOrders.map(JSON.parse)
    console.log("Attempting to populate vaccine database");
    //mash all vaccine orders together and make one big array of objects from them for knex batchInsert
    connection.batchInsert('vaccine_order', allOrdersParsed, 200)
        .then(() => {
            console.log("vaccine query successful");
        })
        .catch((error) => {
            console.error(error);
        });

    const allVaccinationsParsed = (vaccinations.trim().split("\n")).map(JSON.parse)
    connection.batchInsert('vaccine_event', allVaccinationsParsed, 200)
        .then(() => {
            console.log("vaccination query successful");
        })
        .catch((error) => {
            console.error(error);
        });