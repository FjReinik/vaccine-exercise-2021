import React from "react"
import { PieGraph } from "./PieGraph";

export const DataContainer = (props) => {
	return (
		<div className="DataContainer">
			<div className="Header">
				On this day
			</div>
			<div className="ITables">
				<div className="Infotable">
					<div className="Table">
						<div className="TableRow">
							<div className="TableCell">Vaccine doses recieved so far:</div>
							<div className="TableCell">{ props.data.doses }</div>
						</div>
						<div className="TableRow">
							<div className="TableCell">Vaccine orders recieved so far:</div>
							<div className="TableCell">{ props.data.orders }</div>
						</div>
						<div className="TableRow">
							<div className="TableCell">Vaccine orders recieved on this day:</div>
							<div className="TableCell">{ props.data.orders_today }</div>
						</div>
						<div className="TableRow">
							<div className="TableCell">Vaccinations performed so far:</div>
							<div className="TableCell">{ props.data.vaccinations }</div>
						</div>
						<div className="TableRow">
							<div className="TableCell">Vaccinations performed on this day:</div>
							<div className="TableCell">{ props.data.vaccinations_today }</div>
						</div>
					</div>
					<PieGraph text="Ratio of vaccine doses received, so far" data={ props.data.dosage } />
				</div>

			</div>
		</div>
	)
}