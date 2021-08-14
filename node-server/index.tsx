import express from "express";
import { Connect } from "knexfile"


const app = express()
const port = process.env.PORT || 9000
const conn = Connect()

app.get('/getAll', async (request, response) => {
	console.log(`${process.env.DB_PASSWORD}`)
	console.log("connection")
	try {
		await conn.select('*')
			.from('vaccine_order')
			.where('vaccine', '=', 'solarBuddhica')
		)
	.then(function (result))
		response.json([JSON.parse(getall[0].data)])
		console.log("response" + response.json([JSON.parse(getall[0].data)])
		)
	} catch (error) {
		console.log("Vaccine orders are empty, initialize database")
	}
})


app.listen(port, () => console.log(`listening on port: ${port}`))
