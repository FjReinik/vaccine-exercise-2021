import React, { useState } from 'react';
import { Table, TableRow, TableCell } from '../components/Table';
import { PieGraph, PieGraphWrapper } from '../components/PieGraph';
import {
	ContentWrapper,
	Container,
	Title,
	Subheader,
	Button,
	DateForm,
	DateLabel,
	ErrorMessage
} from '../baseStyle'


export const Dataview = () => {
	const [date, setDate] = useState("")
	const [reqdata, setReqdata] = useState(null)
	const [error, setError] = useState(null)



	const handleChange = (event) => {
		setDate(event.target.value)
	}

	const handleError = (str) => {
		setError(str)
	}

	const handleSubmit = (event) => {
		//needed because submit cancels any fetch
		handleError(null)
		event.preventDefault()
		let aggregateData = {}

		//this could be smarter ()like doing thins with a single api request and getting all the data as a single json, rather than doing it on the fronte- but we are going to perform all requests to our server
		//cool technique for doing queries in parallel, ideally this would be in the backend. https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
		Promise.all([
			fetch(`http://localhost:9000/getSingleDateArrival/${ date }`),
			fetch(`http://localhost:9000/getSingleDateVaccination/${ date }`),
			fetch(`http://localhost:9000/getOrderAndVaccinesByProducer/${ date }`),
			fetch(`http://localhost:9000/getOrderAndVaccines/${ date }`),
			fetch(`http://localhost:9000/getAllVaccinationsUptoDate/${ date }`),
			fetch(`http://localhost:9000/getExpiresSoon/${ date }`),
			fetch(`http://localhost:9000/getDayOfTheWeek/${ date }`),
			fetch(`http://localhost:9000/getVaccinationsByHCD/${ date }`),
			fetch(`http://localhost:9000/getExpiredWithoutUse/${ date }`),
			fetch(`http://localhost:9000/getLeftToUse/${ date }`),
			fetch(`http://localhost:9000/getExpiredToday/${ date }`),
		]).then(responses => {
			return Promise.all(responses.map(response => {
				return response.json();
			}));
		}).then(data => {
			data.forEach(obj => {
				aggregateData = Object.assign(aggregateData, obj);
			})
			console.log(aggregateData)
			setReqdata(aggregateData)

		}).catch(error => {
			console.log(error);
			handleError("An error has occured while performing the request")
		})
	}


	const colors = ['#e28800', '#c1d415', '#0a7fc4', '#6de200', '#c40a0a',];
	const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

	return (


		<ContentWrapper>
			{/*
			Formin data -> fetch(it) -> datat propsina childille, jotka renderöi ne
			*/ }
			<Title>Status of vaccines</Title>

			<DateForm onSubmit={ handleSubmit }>
				<DateLabel htmlFor="date">Haettava päivä: </DateLabel>
				<input placeholder="2021-03-20" id="date" onChange={ handleChange } type="date" value={ date } />
				{/* <input placeholder="2021-03-20" type="" /> */ }
				<Button>Submit</Button>
			</DateForm>
			{ (error) || error === "" ? (
				<ErrorMessage>
					{ error }
				</ErrorMessage>
			) : null }
			{ (reqdata) ? (

				<Container>
					<Table>
						<TableRow>
							<TableCell center>On this day</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vaccine doses received so far:</TableCell>
							<TableCell>{ reqdata.doses }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vaccine orders received so far:</TableCell>
							<TableCell>{ reqdata.orders }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vaccine orders received on this day:</TableCell>
							<TableCell>{ reqdata.orders_today }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vaccinations performed so far:</TableCell>
							<TableCell>{ reqdata.vaccinations }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vaccinations performed on this day:</TableCell>
							<TableCell>{ reqdata.vaccinations_today }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vaccines available for use:</TableCell>
							<TableCell>{ reqdata.usable_doses }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vaccines expired this day:</TableCell>
							<TableCell>{ reqdata.expired_today }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Vaccines expired without use:</TableCell>
							<TableCell>{ reqdata.wasted_doses }</TableCell>
						</TableRow>
					</Table>
					<PieGraphWrapper>
						{ reqdata.dosage && reqdata.dosage.length > 0 ? (
							<PieGraph
								title="All vaccine doses"
								text="Ratio of vaccine doses received, to given date"
								chartData={ reqdata.dosage.map((dose, i) => {
									return {
										title: dose.vaccine,
										value: parseInt(dose.doses),
										color: colors[i]
									}
								})
								}
								chartLegend={
									{
										keys: Object.keys(reqdata.dosage[0]),
										data: reqdata.dosage.map((doses, i) => {
											return {
												values: Object.values(doses),
												color: colors[i]
											}
										})
									}
								}
							/>
						) : null }
						{ reqdata.vaccinations_by_HCD && reqdata.vaccinations_by_HCD.length > 0 ? (
							<PieGraph
								title="District distribution"
								text="Vaccinations done by Healthcare district at given date"
								chartData={ reqdata.vaccinations_by_HCD.map((HCD, i) => {
									return {
										title: HCD.healthCareDistrict,
										value: parseInt(HCD.vaccinations),
										color: colors[i]
									}
								})
								}
								chartLegend={
									{
										keys: Object.keys(reqdata.vaccinations_by_HCD[0]),
										data: reqdata.vaccinations_by_HCD.map((HCD, i) => {
											return {
												values: Object.values(HCD),
												color: colors[i]
											}
										})
									}
								}
							/>
						) : null }
						{ reqdata.expiring_soon && reqdata.expiring_soon.length > 0 ? (
							<PieGraph
								title="Expiring soon"
								text="Expiring vaccines (in 10 days) on given date, sorted by manufacturer"
								chartData={ reqdata.expiring_soon.map((expiring, i) => {
									return {
										title: expiring.manufacturer,
										value: parseInt(expiring.available),
										color: colors[i]
									}
								})
								}
								chartLegend={
									{
										keys: Object.keys(reqdata.expiring_soon[0]),
										data: reqdata.expiring_soon.map((expiring, i) => {
											return {
												values: Object.values(expiring),
												color: colors[i]

											}
										})
									}
								}
							/>
						) : null }
					</PieGraphWrapper>
					<Table>
						<TableRow>
							<TableCell align="center">
								Most popular vaccination days
							</TableCell>
						</TableRow>
						{ reqdata.popular_days.map((day) => {
							return (
								<TableRow key={ day.day }>
									<TableCell>
										{ days[day.day] }
									</TableCell>
									<TableCell>
										{ day.day_count }
									</TableCell>
								</TableRow>
							)
						}) }
					</Table>
				</Container>


			) : (
					<Subheader>ei dataa näytettävänä</Subheader>
			) }
		</ContentWrapper>
	);
}
