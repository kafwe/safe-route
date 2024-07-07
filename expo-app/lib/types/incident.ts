type Incident = {
	type: string;
	description: string;
	location: {
		latitude: number;
		longitude: number;
	};
	datetime: string;
};

export default Incident;