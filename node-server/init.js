"use strict";
//tämän kääntmäistä typescriptiksi ei koettu tarpeelliseksi.
Object.defineProperty(exports, "__esModule", { value: true });
var knexfile_1 = require("./knexfile");
var connection = knexfile_1.Connect();
const fs = require('fs');
const { parse } = require("path");
var antiqua = ""
var solarBuddhica = ""
var zerpfy = ""
var vaccinations = ""
try {
    antiqua = fs.readFileSync("../resources/Antiqua.source", "utf8")
    zerpfy = fs.readFileSync("../resources/Zerpfy.source", "utf8")
    solarBuddhica = fs.readFileSync("../resources/SolarBuddhica.source", "utf8")
    vaccinations = fs.readFileSync("../resources/vaccinations.source", "utf8")


    const allOrders = (zerpfy + solarBuddhica + antiqua).trim().split("\n")
    const allOrdersParsed = allOrders.map(JSON.parse)
    console.log("Attempting to populate vaccine database");
    //mash all vaccine orders together and make one big array of objects from them for knex batchInsert
    connection.batchInsert('vaccine_order', allOrdersParsed, 200)
        .then(function() {
            console.log("vaccine query successful");
        })
        .catch(function(error) {
            console.error(error);
        });

    const allVaccinationsParsed = (vaccinations.trim().split("\n")).map(JSON.parse)
    connection.batchInsert('vaccine_event', allVaccinationsParsed, 200)
        .then(function() {
            console.log("vaccination query successful");
        })
        .catch(function(error) {
            console.error(error);
        });

} catch(error) {
    console.log(error);
}
