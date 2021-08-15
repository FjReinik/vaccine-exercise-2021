import React from "react"
import { PieGraph } from '../components/PieGraph'
import { Table } from '../components/Table'

export const QueryContainer: React.FunctionComponent = (props) => {
	return (
		<div className="DataContainer">
			<Table>

			</Table>
			<PieGraph>

			</PieGraph>
		</div>
	)
}