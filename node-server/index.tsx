import express from "express";
import { Connect } from "knexfile"


const app = express()
const port = process.env.PORT || 9000
const conn = Connect()

app.get('/getAll', async (request, response) => {
	await conn.select()
		.from('vaccine_order')
		.then(function (result) {
			response.send(result)
		})
})

app.get('/getSingleDate/:date', async (request, response) => {
	const fromDate = new Date(request.params.date)
	let toDate = new Date(request.params.date)
	toDate.setDate(fromDate.getDate() + 1)
	await conn.select()
		.from('vaccine_order')
		.whereBetween('arrived', [fromDate, toDate])
		.then(function (result) {
			response.send(result)
		})
})
/*
app.get('/getBetweenDate/:date', async (request, response) => {
	const fromDate = new Date(request.params.date)
	const toDate = new Date(request.params.toDate)
	console.log(toDate);
	console.log(fromDate);
	await conn.select()
		.from('vaccine_order')
		.whereBetween('arrived', [fromDate, toDate])
		.then(function (result) {
			console.log(result)
			response.send(result)
		})
})
*/

/**

## List of interesting things

For given day like 2021-04-12T11:10:06

* How many orders and vaccines have arrived total?
* How many of the vaccinations have been used?
* How many orders/vaccines per producer?
* How many bottles have expired on the given day (remember a bottle expires 30 days after arrival)
* How many vaccines expired before the usage -> remember to decrease used injections from the expired bottle
* How many vaccines are left to use?
* How many vaccines are going to expire in the next 10 days?

Perhaps there is some other data which could tell us some interesting things?

## Some numbers to help you

* Total number of orders 5000
* Vaccinations done 7000
* "2021-03-20" arrived 61 orders.
* When counted from "2021-04-12T11:10:06.473587Z" 12590 vaccines expired before usage (injections in the expiring bottles 17423
  and injections done from the expired bottles 4833)
 * **/


app.listen(port, () => console.log(`listening on port: ${port}`))
