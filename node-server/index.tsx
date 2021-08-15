import express from "express";
import Knex from "knex";


const app = express()
const port = process.env.PORT || 9000

//brought knex to index.tsx due to issues with compiling the require directory
const Connect = () => {
	return Knex({
		client: "pg",
		connection: {
			database: "vaccinedb",
			user: "postgres",
			password: "admin",
			host: "localhost",
			port: Number(`${process.env.PG_PORT}` || 5432),
		},
		pool: { min: 0, max: 100 },
		acquireConnectionTimeout: 10000,
	});
};

const conn = Connect()


//get the count of orders recieved during a given day
app.get('/getSingleDateArrival/:date', async (request, response) => {
	const fromDate = (request.params.date + 'T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.select()
		.from('vaccine_order')
		.whereBetween('arrived', [fromDate, toDate])
		.then((result) => {
			response.send(result)
		})
		.catch((error) => {
			console.log(error)
		})
})

//get the count of vaccinations done during a day
app.get('/getSingleDateVaccination/:date', async (request, response) => {
	const fromDate = (request.params.date + 'T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.select()
		.from('vaccine_event')
		.whereBetween('vaccinationDate', [fromDate, toDate])
		.then((result) => {
			response.send(result)
		})
		.catch((error) => {
			console.log(error)
		})
})

// How many orders and vaccines have arrived total on a given day
app.get('/getOrderAndVaccines/:date', async (request, response) => {
	const yearStart = new Date('2021-01-01T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.count({ orders: 'orderNumber' })
		.sum({ doses: 'injections' })
		.from('vaccine_order')
		.whereBetween('arrived', [yearStart, toDate])
		.then((result) => {
			response.send(result)
		})
		.catch((error) => {
			console.log(error)
		})
})

//Returns orders and doses of vaccine, grouped by vaccine manufacturer, from year start to end of given date
app.get('/getOrderAndVaccinesByProducer/:date', async (request, response) => {
	const yearStart = new Date('2021-01-01T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.select('vaccine')
		.count({ orders: 'orderNumber' })
		.sum({ doses: 'injections' })
		.from('vaccine_order')
		.groupBy('vaccine')
		.whereBetween('arrived', [yearStart, toDate])
		.then((result) => {
			response.send(result)
		})
		.catch((error) => {
			console.log(error)
		})
})

// How many of the vaccinations have been used?
//joinia

// How many bottles have expired on the given day (remember a bottle expires 30 days after arrival)
//Joinia

// How many vaccines expired before the usage -> remember to decrease used injections from the expired bottle
//joinia

// How many vaccines are left to use?
//joinia

// How many vaccines are going to expire in the next 10 days?
//joinia

// Most popular day of the week for vaccinations? - Seems like data that has some utility

//

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

/**

## List of interesting things


Perhaps there is some other data which could tell us some interesting things?

* Total number of orders 5000
* Vaccinations done 7000
* When counted from "2021-04-12T11:10:06.473587Z" 12590 vaccines expired before usage (injections in the expiring bottles 17423
  and injections done from the expired bottles 4833)
 * **/


app.listen(port, () => console.log(`listening on port: ${port}`))
