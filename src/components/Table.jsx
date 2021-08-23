import { TableContainer, TableCellItem, TableRowItem } from "./styles"

export const Table = (props) => {
	return (
		<TableContainer>
			{ props.children }
		</TableContainer>
	)
}

export const TableRow = (props) => {
	return (
		<TableRowItem>
			{ props.children }
		</TableRowItem>
	)
}

export const TableCell = (props) => {
	return (
		<TableCellItem>
			{ props.children }
		</TableCellItem>
	)
}


