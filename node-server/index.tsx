import express from "express";
import Knex from "knex";
import Cors from "cors";



const app = express()
app.use(express.json())
//cors needed when server is at a different port than our frontend
app.use(Cors())
const port = 9000

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
	response.setHeader('Content-Type', 'application/json')
	const fromDate = (request.params.date + 'T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.count({ orders_today: 'id' })
		.from('vaccine_order')
		.whereBetween('arrived', [fromDate, toDate])
		.then((result) => {
			if (response.status(200)) {
				response.status(200).send(result)
			} else {
				response.send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

//get the count of vaccinations done during a day
app.get('/getSingleDateVaccination/:date', async (request, response) => {
	response.setHeader('Content-Type', 'application/json')
	const fromDate = (request.params.date + 'T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.count({ vaccinations_today: 'vaccination-id' })
		.from('vaccine_event')
		.whereBetween('vaccinationDate', [fromDate, toDate])
		.then((result) => {
			if (response.status(200)) {
				response.status(200).send(result)

			} else {
				response.send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

// How many vaccinations has been done upto date
app.get('/getAllVaccinationsUptoDate/:date', async (request, response) => {
	const fromDate = ('2021-01-01T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.count({ vaccinations: 'vaccination-id' })
		.from('vaccine_event')
		.whereBetween('vaccinationDate', [fromDate, toDate])
		.then((result) => {
			if (response.status(200)) {
				response.status(200).send(result)

			} else {
				response.send("Error")
			}
		})
		.catch((error) => {
			console.log(error)

		})
})

// How many orders and vaccines have arrived total on a given day
app.get('/getOrderAndVaccines/:date', async (request, response) => {
	const yearStart = new Date('2021-01-01T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	console.log("fetch")
	await conn.count({ orders: 'orderNumber' })
		.sum({ doses: 'injections' })
		.from('vaccine_order')
		.whereBetween('arrived', [yearStart, toDate])
		.then((result) => {
			if (response.status(200)) {
				response.status(200).send(result)

			} else {
				response.send("Error")
			}
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
			if (response.status(200)) {
				response.status(200).send(result)

			} else {
				response.send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

// How many of the vaccinations have been used?

// How many bottles have expired on the given day (remember a bottle expires 30 days after arrival)

// How many vaccines expired before the usage -> remember to decrease used injections from the expired bottle

// How many vaccines are left to use?

// How many vaccines are going to expire in the next 10 days?

// Most popular day of the week for vaccinations? - Seems like data that has some utility
// Most popular hour of day?

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



app.listen(port, () => console.log(`listening on port: ${port}`))
