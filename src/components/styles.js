import styled from 'styled-components'

//so few components that it didn't seem to be a good idea to differentiate the components. 
//In a larger project -> refactor into single concept folders, like Table, Graph, with their own subdivisions when needed etc


export const TableContainer = styled.div`
	border-top-left-radius: 5px;
	border-top-right-radius:5px;
	border: solid 2px #3f4747;
	border-bottom: solid 1px;
	display: flex;
	flex-direction: column;
	max-width: 800px;
	@media only screen and (min-width: 768px) {


		margin: 20px auto;

	}
`;


export const TableRowItem = styled.div`
	background: #d7f7f4;
	display: inline-flex;
    justify-content: center;
	transition: 200ms;
    width: 100%;

	&:nth-child(odd) {
		background: #ebfcfa;
	}

	&:hover {
		background: #d2fcf8;
	}
`;


export const TableCellItem = styled.div`
	padding: 5px 10px;
	text-align: left;
	width: 100%;

	&:nth-child(2) {
		width: 50%;
	}

	&:only-child {
		text-align: center;
	}
`;


export const GraphContainer = styled.div`

`;


export const GraphsWrapper = styled.div`

	display: flex;
    flex-direction: column;
	margin: 30px auto;

	svg {
		max-width: 250px;
	}


`;

//these actually could be just table cells, but dont want to mix components so separate they shall be
//shame about the doubled up styles
export const GraphTableWrapper = styled.div`
	border-top-left-radius: 5px;
    border-top-right-radius:5px;
	border: solid 2px #3f4747;
	border-bottom: solid 1px;
	display: flex;
    flex-direction: column;
    margin: 20px auto;
	max-width: 800px;

`;


export const GraphTableRow = styled.div`
	background: #d7f7f4;
	display: inline-flex;
    justify-content: center;
	transition: 200ms;
    width: 100%;

	&:nth-child(odd) {
		background: #ebfcfa;
	}

	&:hover {
		background: #d2fcf8;
	}
`;


export const GraphTableCell = styled.div`
	text-transform: capitalize;
	padding: 5px 10px;
	text-align: left;
	width: 50%;
`;


export const GraphColorTableCell = styled.div`
	text-transform: capitalize;
	padding: 5px 10px;
	text-align: left;
	width: 10%;
`;


export const GraphSpacerTableCell = styled.div`
	padding: 5px 10px;
	text-align: center;
	width: 10%;
`;


export const ColorIcon = styled.div`
	background-color:  ${ props => props.color || "transparent" };
	border-radius: 50%;
	padding: 5px;
	margin: 0 auto;
	text-align: left;
	height: 10px;
	width: 10px;
`;


export const InfoText = styled.p`
	margin: 0;
	font-style: italic;
`;

