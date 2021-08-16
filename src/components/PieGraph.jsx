import React from "react"
import { PieChart } from 'react-minimal-pie-chart';


export const PieGraph = (props) => {
	//No need to try to keep this generic, as there is just a single graph
	const colors = ['#e28800', '#c29f12', '#0a7fc4'];
	const array = props.data.map((arr, i) => ({ title: arr.vaccine, value: parseInt(arr.doses), color: colors[i] }))
	const table = props.data.map((arr) => ({ name: arr.vaccine, doses: arr.doses, orders: arr.orders }))

	return (
		<div className="GraphContainer">

			<PieChart
				animate={ true }
				data={ array }
				style={
					{ 'margin': '30px 0px' }
				}
			/>
			<div className="GraphTable">
				<div className="TableRow">
					<div className="TableCell">
						Name
					</div>
					<div className="TableCell">
						Doses
					</div>
					<div className="TableCell">
						Orders
					</div>
				</div>
			</div>
			{ table
				.map((arr) => (
					<div key={ arr.name } className="TableRow">
						<div className="TableCell">
							{ arr.name }
						</div>
						<div className="TableCell">
							{ arr.doses }
						</div>
						<div className="TableCell">
							{ arr.orders }
						</div>
					</div>
				))
			}
			<span>{ props.text }</span>
		</div>
	);
}
