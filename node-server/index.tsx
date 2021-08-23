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
app.get('/getSingleDateArrival/:date', async (request, response) => {
	response.setHeader('Content-Type', 'application/json')
	const fromDate = (request.params.date + 'T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.count({ orders_today: 'id' })
		.from('vaccine_order')
		.whereBetween('arrived', [fromDate, toDate])
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json(result[0])
			} else {
				//real helpful error message
				response.status(400).send("Error")
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
				response.status(200).json(result[0])

			} else {
				response.status(400).send("Error")
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
				response.status(200).json(result[0])

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)

		})
})

// How many orders and vaccines have arrived total on a given day
app.get('/getOrderAndVaccines/:date', async (request, response) => {
	const yearStart = ('2021-01-01T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.count({ orders: 'orderNumber' })
		.sum({ doses: 'injections' })
		.from('vaccine_order')
		.whereBetween('arrived', [yearStart, toDate])
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json(result[0])

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

//Returns orders and doses of vaccine, grouped by vaccine manufacturer, from year start to end of given date
app.get('/getOrderAndVaccinesByProducer/:date', async (request, response) => {
	const yearStart = ('2021-01-01T00:00:00Z')
	const toDate = (request.params.date + 'T23:59:59Z')
	await conn.select('vaccine')
		.count({ orders: 'orderNumber' })
		.sum({ doses: 'injections' })
		.from('vaccine_order')
		.groupBy('vaccine')
		.whereBetween('arrived', [yearStart, toDate])
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json({ 'dosage': result })

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})


// How many bottles have expired on the given day (remember a bottle expires 30 days after arrival)
app.get('/getExpiredToday/:date', async (request, response) => {
	const dayStart: Date = new Date(request.params.date + ' 00:00:00')
	const dayEnd: Date = new Date(request.params.date + ' 23:59:59Z')
	await conn.count({ expired_today: 'injections' })
		.from('vaccine_order')
		.whereBetween('arrived', [dayStart, dayEnd])
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json(result[0])

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

// How many vaccines expired before the usage -> remember to decrease used injections from the expired bottle
//When counted from "2021-04-12T11:10:06.473587Z" 12590 vaccines expired before usage (injections in the expiring bottles 17423 and injections done from the expired bottles 4833)

app.get('/getExpiredWithoutUse/:date', async (request, response) => {
	const timeEnd = new Date(request.params.date + ' 23:59:59Z')
	await conn.raw(`
		select sum(injections)
			- (select count(*)
				from vaccine_event
				inner JOIN vaccine_order
				on vaccine_order.id = vaccine_event."sourceBottle"
				where vaccine_order.arrived
				between '2021-01-01T00:00:00Z'::timestamp and '${timeEnd.toISOString()}'::timestamp - interval '30 day') as wasted_doses
		from vaccine_order
		where vaccine_order.arrived
		between '2021-01-01T00:00:00Z'::timestamp
		and '${timeEnd.toISOString()}'::timestamp - interval '30 day'
	`)
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json(result.rows[0])

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

// How many vaccines are left to use? (sum of injections - count of vaccinations)
// Done with raw string as knex doesn't seem to support calculating. It could be done in two sets but already done in sql, so here it goes

app.get('/getLeftToUse/:date', async (request, response) => {
	const timeEnd = new Date(request.params.date + ' 23:59:59Z')
	await conn.raw(`
		select sum(injections) - (select count(*)
				from vaccine_event
				inner JOIN vaccine_order
				on vaccine_order.id = vaccine_event."sourceBottle"
				where vaccine_order.arrived
				between '${timeEnd.toISOString()}'::timestamp - interval '30 day' 
				and '${timeEnd.toISOString()}'::timestamp) as usable_doses
		from vaccine_order
		where vaccine_order.arrived between '${timeEnd.toISOString()}'::timestamp - interval '30 day' and '${timeEnd.toISOString()}'::timestamp
	`)
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json(result.rows[0])

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

// How many vaccines are going to expire in the next 10 days? sum of injections

app.get('/getExpiresSoon/:date', async (request, response) => {
	const time = new Date(request.params.date + ' 23:59:59Z')
	await conn.raw(`
		select (sum(injections) - count(vaccine_event."vaccination-id")) as available
		, vaccine as manufacturer
		from vaccine_order RIGHT JOIN vaccine_event on vaccine_order.id = vaccine_event."sourceBottle"
		where vaccine_order.arrived between '${time.toISOString()}'::timestamp - interval '30 day' and '${time.toISOString()}'::timestamp -interval '20 day'
		GROUP by vaccine_order.injections
		, vaccine_order.vaccine
	`)
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json({ 'expiring_soon': result.rows })

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

// Most popular day of the week for vaccinations? - Seems like data that has some utility

app.get('/getDayOfTheWeek/:date', async (request, response) => {
	const time = request.params.date + 'T00:00:00Z'
	await conn.raw(`
		select count(daylist.day) day_count, day
		from (
			select extract(ISODOW
			from vaccine_event."vaccinationDate")
			as day
			from vaccine_event
			where vaccine_event."vaccinationDate"  between '2021-01-01T00:00:00'::timestamp and '${time}'::timestamp
			group by vaccine_event."vaccinationDate"
		) as daylist
		group by day
		order by day_count desc
		`)
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json({ 'popular_days': result.rows })

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})


// vaccinations done by healthcare district
app.get('/getVaccinationsByHCD/:date', async (request, response) => {
	const timeEnd = new Date(request.params.date + 'T00:00:00Z')
	await conn.raw(`
		select count(vaccine_event."vaccination-id") as vaccinations, "healthCareDistrict"
		from vaccine_event inner join vaccine_order on "sourceBottle" = vaccine_order.id
		where vaccine_event."vaccinationDate"  between '2021-01-01T00:00:00Z'::timestamp and '${timeEnd.toISOString()}'::timestamp
		group by vaccine_order."healthCareDistrict"
		`)
		.then((result) => {
			if (response.status(200)) {
				response.status(200).json({ 'vaccinations_by_HCD': result.rows })

			} else {
				response.status(400).send("Error")
			}
		})
		.catch((error) => {
			console.log(error)
		})
})


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


app.listen(port, () => console.log(`listening on port: ${port}`))
