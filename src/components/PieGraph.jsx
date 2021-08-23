import { PieChart } from 'react-minimal-pie-chart';
import {
	GraphsWrapper,
	GraphContainer,
	GraphTableWrapper,
	GraphTableRow,
	GraphTableCell,
	GraphColorTableCell,
	ColorIcon,
	GraphSpacerTableCell,
	InfoText
} from './styles';


export const PieGraph = (props) => {
	return (
		<GraphContainer>
			<PieChart
				animate={ true }
				data={ props.chartData }
				style={
					{ 'margin': '30px 0px' }
				}
			/>
			<GraphTableWrapper>
				<GraphTableRow>
					{ props.chartLegend.keys.map((key) => {
						return (
							<GraphTableCell key={ key }>
								{ key }
							</GraphTableCell>
						)
					}) }
					<GraphSpacerTableCell>
						Color
					</GraphSpacerTableCell>
				</GraphTableRow>
				{ props.chartLegend.data.map((valRow, i) => {
					return (
						<GraphTableRow key={ i }>
							{ valRow.values.map((val) => {
								return (
									<GraphTableCell key={ val }>
										{ val }
									</GraphTableCell>
								)
							}) }
							<GraphColorTableCell>
								<ColorIcon color={ valRow.color } />
							</GraphColorTableCell>
						</GraphTableRow>
					)
				}) }
			</GraphTableWrapper>
			<InfoText>{ props.text }</InfoText>
		</GraphContainer>
	);
}

export const PieGraphWrapper = (props) => {
	return (
		<GraphsWrapper>
			{ props.children }
		</GraphsWrapper>
	)
}
