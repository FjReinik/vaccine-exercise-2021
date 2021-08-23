import styled from 'styled-components'

export const AppWrapper = styled.div`
	background-color: #ebfcfa;
	height: 100%;
	min-height: 100vh;
	padding: 0 15px;
	text-align: center;
`;


export const ContentWrapper = styled.div`
	max-width: 1200px;
	margin: 0 auto;
`;

export const Container = styled.div`
	margin: 0 auto;
`;


export const Title = styled.h1`
	padding: 2em 0px;
	text-align: center;
`;

export const Subheader = styled.h2`
	padding: 1em 0px;
	text-align: center;
`;

export const DateForm = styled.form`
	background-color: #ebfcfa;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 0 auto;
	max-width: 215px;
	padding: 0 15px;
	
`;

export const DateLabel = styled.label`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
`;

export const Button = styled.button`
	background: #d7f7f4;
	border: 2px solid #000;
	border-radius: 3px;
	font-size: 1em;
	margin: 15px;
	padding: 0.3em 1em;
	transition: 350ms;

	&:hover {
		background: #aefff7;
	}

`;

export const ErrorMessage = styled.div`
	background: #d7f7f4;
	border: 2px solid red;
	border-radius: 3px;
	color: red;
	font-size: 1em;
	margin: 15px auto;
	padding: 0.3em 1em;
	max-width: 400px;

`;
