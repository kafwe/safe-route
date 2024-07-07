type Incident = {
    address: string | null;
    carMake: string | null;
    carModel: string | null;
    carYear: number | null;
    description: string | null;
    incidentId: string;
    latitude: number | null;
    licensePlate: string | null;
    location_name: string | null;
    longitude: number | null;
    timestamp: string | null;
    type: string | null;
};

export default Incident;