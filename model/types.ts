
export type order = {
	id: string;
	healthCareDistrict: string;
	orderNumber: string;
	responsiblePerson: string;
	injections: string;
	arrived: string;
	vaccine: string;
}

export type event = {
	vaccination_id: string;
	gender: string;
	sourceBottle: string;
	injected: string;
}
