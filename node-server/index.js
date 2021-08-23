"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var knex_1 = __importDefault(require("knex"));
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
app.use(express_1.default.json());
//cors needed when server is at a different port than our frontend
app.use(cors_1.default());
var port = 9000;
//brought knex to index.tsx due to issues with compiling the require directory
var Connect = function () {
    return knex_1.default({
        client: "pg",
        connection: {
            database: "vaccinedb",
            user: "postgres",
            password: "admin",
            host: "localhost",
            port: Number("" + process.env.PG_PORT || 5432),
        },
        pool: { min: 0, max: 100 },
        acquireConnectionTimeout: 10000,
    });
};
var conn = Connect();
/*
// what if I got all the info from a single api
app.get('/getAllData/:date', async (request, response) => {
    await conn.raw(`¨
        `)
        .then((result) => {
            if (response.status(200)) {
                response.status(200).json(result)

            } else {
                response.status(400).send("Error")
            }
        })
        .catch((error) => {
            console.log(error)
        })
})
*/
//get the count of orders recieved during a given day
app.get('/getSingleDateArrival/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var fromDate, toDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response.setHeader('Content-Type', 'application/json');
                fromDate = (request.params.date + 'T00:00:00Z');
                toDate = (request.params.date + 'T23:59:59Z');
                return [4 /*yield*/, conn.count({ orders_today: 'id' })
                        .from('vaccine_order')
                        .whereBetween('arrived', [fromDate, toDate])
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json(result[0]);
                        }
                        else {
                            //real helpful error message
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//get the count of vaccinations done during a day
app.get('/getSingleDateVaccination/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var fromDate, toDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response.setHeader('Content-Type', 'application/json');
                fromDate = (request.params.date + 'T00:00:00Z');
                toDate = (request.params.date + 'T23:59:59Z');
                return [4 /*yield*/, conn.count({ vaccinations_today: 'vaccination-id' })
                        .from('vaccine_event')
                        .whereBetween('vaccinationDate', [fromDate, toDate])
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json(result[0]);
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// How many vaccinations has been done upto date
app.get('/getAllVaccinationsUptoDate/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var fromDate, toDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fromDate = ('2021-01-01T00:00:00Z');
                toDate = (request.params.date + 'T23:59:59Z');
                return [4 /*yield*/, conn.count({ vaccinations: 'vaccination-id' })
                        .from('vaccine_event')
                        .whereBetween('vaccinationDate', [fromDate, toDate])
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json(result[0]);
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// How many orders and vaccines have arrived total on a given day
app.get('/getOrderAndVaccines/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var yearStart, toDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                yearStart = ('2021-01-01T00:00:00Z');
                toDate = (request.params.date + 'T23:59:59Z');
                return [4 /*yield*/, conn.count({ orders: 'orderNumber' })
                        .sum({ doses: 'injections' })
                        .from('vaccine_order')
                        .whereBetween('arrived', [yearStart, toDate])
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json(result[0]);
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//Returns orders and doses of vaccine, grouped by vaccine manufacturer, from year start to end of given date
app.get('/getOrderAndVaccinesByProducer/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var yearStart, toDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                yearStart = ('2021-01-01T00:00:00Z');
                toDate = (request.params.date + 'T23:59:59Z');
                return [4 /*yield*/, conn.select('vaccine')
                        .count({ orders: 'orderNumber' })
                        .sum({ doses: 'injections' })
                        .from('vaccine_order')
                        .groupBy('vaccine')
                        .whereBetween('arrived', [yearStart, toDate])
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json({ 'dosage': result });
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// How many bottles have expired on the given day (remember a bottle expires 30 days after arrival)
app.get('/getExpiredToday/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var dayStart, dayEnd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dayStart = new Date(request.params.date + ' 00:00:00');
                dayEnd = new Date(request.params.date + ' 23:59:59Z');
                return [4 /*yield*/, conn.count({ expired_today: 'injections' })
                        .from('vaccine_order')
                        .whereBetween('arrived', [dayStart, dayEnd])
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json(result[0]);
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// How many vaccines expired before the usage -> remember to decrease used injections from the expired bottle
//When counted from "2021-04-12T11:10:06.473587Z" 12590 vaccines expired before usage (injections in the expiring bottles 17423 and injections done from the expired bottles 4833)
app.get('/getExpiredWithoutUse/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var timeEnd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                timeEnd = new Date(request.params.date + ' 23:59:59Z');
                return [4 /*yield*/, conn.raw("\n\t\tselect sum(injections)\n\t\t\t- (select count(*)\n\t\t\t\tfrom vaccine_event\n\t\t\t\tinner JOIN vaccine_order\n\t\t\t\ton vaccine_order.id = vaccine_event.\"sourceBottle\"\n\t\t\t\twhere vaccine_order.arrived\n\t\t\t\tbetween '2021-01-01T00:00:00Z'::timestamp and '" + timeEnd.toISOString() + "'::timestamp - interval '30 day') as wasted_doses\n\t\tfrom vaccine_order\n\t\twhere vaccine_order.arrived\n\t\tbetween '2021-01-01T00:00:00Z'::timestamp\n\t\tand '" + timeEnd.toISOString() + "'::timestamp - interval '30 day'\n\t")
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json(result.rows[0]);
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// How many vaccines are left to use? (sum of injections - count of vaccinations)
// Done with raw string as knex doesn't seem to support calculating. It could be done in two sets but already done in sql, so here it goes
app.get('/getLeftToUse/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var timeEnd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                timeEnd = new Date(request.params.date + ' 23:59:59Z');
                return [4 /*yield*/, conn.raw("\n\t\tselect sum(injections) - (select count(*)\n\t\t\t\tfrom vaccine_event\n\t\t\t\tinner JOIN vaccine_order\n\t\t\t\ton vaccine_order.id = vaccine_event.\"sourceBottle\"\n\t\t\t\twhere vaccine_order.arrived\n\t\t\t\tbetween '" + timeEnd.toISOString() + "'::timestamp - interval '30 day' \n\t\t\t\tand '" + timeEnd.toISOString() + "'::timestamp) as usable_doses\n\t\tfrom vaccine_order\n\t\twhere vaccine_order.arrived between '" + timeEnd.toISOString() + "'::timestamp - interval '30 day' and '" + timeEnd.toISOString() + "'::timestamp\n\t")
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json(result.rows[0]);
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// How many vaccines are going to expire in the next 10 days? sum of injections
app.get('/getExpiresSoon/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var time;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                time = new Date(request.params.date + ' 23:59:59Z');
                return [4 /*yield*/, conn.raw("\n\t\tselect (sum(injections) - count(vaccine_event.\"vaccination-id\")) as available\n\t\t, vaccine as manufacturer\n\t\tfrom vaccine_order RIGHT JOIN vaccine_event on vaccine_order.id = vaccine_event.\"sourceBottle\"\n\t\twhere vaccine_order.arrived between '" + time.toISOString() + "'::timestamp - interval '30 day' and '" + time.toISOString() + "'::timestamp -interval '20 day'\n\t\tGROUP by vaccine_order.injections\n\t\t, vaccine_order.vaccine\n\t")
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json({ 'expiring_soon': result.rows });
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Most popular day of the week for vaccinations? - Seems like data that has some utility
app.get('/getDayOfTheWeek/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var time;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                time = request.params.date + 'T00:00:00Z';
                return [4 /*yield*/, conn.raw("\n\t\tselect count(daylist.day) day_count, day\n\t\tfrom (\n\t\t\tselect extract(ISODOW\n\t\t\tfrom vaccine_event.\"vaccinationDate\")\n\t\t\tas day\n\t\t\tfrom vaccine_event\n\t\t\twhere vaccine_event.\"vaccinationDate\"  between '2021-01-01T00:00:00'::timestamp and '" + time + "'::timestamp\n\t\t\tgroup by vaccine_event.\"vaccinationDate\"\n\t\t) as daylist\n\t\tgroup by day\n\t\torder by day_count desc\n\t\t")
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json({ 'popular_days': result.rows });
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// vaccinations done by healthcare district
app.get('/getVaccinationsByHCD/:date', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var timeEnd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                timeEnd = new Date(request.params.date + 'T00:00:00Z');
                return [4 /*yield*/, conn.raw("\n\t\tselect count(vaccine_event.\"vaccination-id\") as vaccinations, \"healthCareDistrict\"\n\t\tfrom vaccine_event inner join vaccine_order on \"sourceBottle\" = vaccine_order.id\n\t\twhere vaccine_event.\"vaccinationDate\"  between '2021-01-01T00:00:00Z'::timestamp and '" + timeEnd.toISOString() + "'::timestamp\n\t\tgroup by vaccine_order.\"healthCareDistrict\"\n\t\t")
                        .then(function (result) {
                        if (response.status(200)) {
                            response.status(200).json({ 'vaccinations_by_HCD': result.rows });
                        }
                        else {
                            response.status(400).send("Error");
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//TODO maybe
/*
** vaccinations/other data between two given dates?
**
app.get('/getBetweenDate/:fromDate/:toDate', async (request, response) => {
    const fromDate = new Date(request.params.fromDate)
    const toDate = new Date(request.params.toDate)
    console.log(toDate);
    console.log(fromDate);
    await conn.select()
        .from('vaccine_order')
        .whereBetween('arrived', [fromDate, toDate])
        .then((result) =>  {
            console.log(result)
            response.send(result)
        })
})
*/
app.listen(port, function () { return console.log("listening on port: " + port); });
