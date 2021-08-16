import React, { useState } from "react";
import { Container } from '../components/Container';
import { DataContainer } from '../components/DataContainer';


export const Dataview = () => {
	const [date, setDate] = useState("")
	const [reqdata, setReqdata] = useState(null)

	const handleChange = (event) => {
		setDate(event.target.value)
	}

	const handleSubmit = (event) => {
		//needed because submit cancels any fetch
		event.preventDefault()
		let aggregateData = {}

		//this could be smarter - but we are going to perform all requests to our server
		//cool technique, imo https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
		Promise.all([
			fetch(`http://localhost:9000/getSingleDateArrival/${ date }`),
			fetch(`http://localhost:9000/getSingleDateVaccination/${ date }`),
			fetch(`http://localhost:9000/getOrderAndVaccinesByProducer/${ date }`),
			fetch(`http://localhost:9000/getOrderAndVaccines/${ date }`),
			fetch(`http://localhost:9000/getAllVaccinationsUptoDate/${ date }`),
		]).then(responses => {
			return Promise.all(responses.map(response => {
				return response.json();
			}));
		}).then(data => {
			data.forEach(arr => {
				if(arr.length === 1) {
					for(const i in arr) {
						aggregateData = Object.assign(aggregateData, arr[i]);
					}
				} else {
					aggregateData['dosage'] = arr
				}

			})
			setReqdata(aggregateData)
		}).catch(error => {
			console.log(error);
		})
	}

	return (
		<Container>
			{/*
			Formin data -> fetch(it) -> datat propsina childille, jotka renderöi ne
			*/ }

			<form onSubmit={ handleSubmit }>
				<label htmlFor="date">Haettava päivä:</label>
				<input placeholder="2021-03-20" id="date" onChange={ handleChange } type="date" value={ date } />
				{/* <input placeholder="2021-03-20" type="" /> */ }
				<button>Submit</button>
			</form>
			{ (reqdata) && DataContainer ? (
				<DataContainer data={ reqdata } />
			) : (
				<h2>ei dataa näytettävänä</h2>
			) }
		</Container>
	);
}
