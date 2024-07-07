import { createClient } from '@supabase/supabase-js';
import { User } from "@/types/user";
import { Trip } from "@/types/trip";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchTotalTrips = async () => {
  const { data, error } = await supabase
    .from('trips')
    .select('*', { count: 'exact' });

  if (error) throw error;
  return data.length;
}

export const fetchTotalIncidents = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*', { count: 'exact' });

  if (error) throw error;
  return data.length;
}

export const fetchAverageRiskScore = async () => {
  const { data, error } = await supabase
    .from('trips')
    .select('riskScore');

  if (error) throw error;

  const totalScore = data.reduce((sum, trip) => sum + trip.riskScore, 0);
  return Math.round((totalScore / data.length) * 100) / 100;
}

export const fetchRecentIncidents = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('date', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
}


export const fetchTotalTripsPerMonth = async () => {
    const { data, error } = await supabase
        .from('trips')
        .select('startTime')
        .order('startTime', { ascending: true });
    
    if (error) throw error;
    
    const tripsPerMonth = data.reduce((acc, trip) => {
        const month = new Date(trip.startTime).toLocaleString('default', { month: 'long' });
        const existingMonthIndex = acc.findIndex(item => item.month === month);
        
        if (existingMonthIndex !== -1) {
            acc[existingMonthIndex].trips++;
        } else {
            acc.push({ month: month, trips: 1 });
        }
        
        return acc;
    }, []);

    return tripsPerMonth;
};


export const fetchAndSubscribeToIncidents = async (setIncidents) => {
    // Initial fetch
    let { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);
  
    if (error) throw error;
    setIncidents(data);
  
    // Set up real-time subscription
    supabase
      .from('incidents')
      .on('*', (payload) => {
        // Fetch the updated incidents again
        supabase
          .from('incidents')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(5)
          .then(({ data, error }) => {
            if (error) throw error;
            setIncidents(data);
          });
      })
      .subscribe();
  };


export const fetchUsers = async (): Promise<User[]> => {
    // Fetch users
    const { data: usersData, error: usersError } = await supabase
      .from<User>('users')
      .select('*');
  
    if (usersError) throw usersError;
  
    // Fetch trips
    const { data: tripsData, error: tripsError } = await supabase
      .from<Trip>('trips')
      .select('*');
  
    if (tripsError) throw tripsError;
  
    // Calculate average trip distance, average risk score, and total risk score for each user
    const updatedUsers = usersData.map((user) => {
      // Filter trips for the current user
      const userTrips = tripsData.filter((trip) => trip.userId === user.id);
  
      // Calculate total risk score
      const totalRiskScore = userTrips.reduce((acc, trip) => acc + Number(trip.riskScore), 0);
  
      // Calculate average risk score
      const avgRiskScore = totalRiskScore / userTrips.length;
  
      // Calculate average trip distance
      const avgTripDistance = userTrips.reduce((acc, trip) => acc + Number(trip.distance), 0) / userTrips.length;
  
      // Return updated user object with calculated fields
      return {
        ...user,
        avgTripDistance,
        avgRiskScore,
        totalRiskScore,
      };
    });
  
    return updatedUsers;
  };
  
  export const fetchTripsByUserId = async (userId) => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    return data;
  }

  export const fetchAllTrips = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*');

    if (error) throw error;
    return data;
  }


