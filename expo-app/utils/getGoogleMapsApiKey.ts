import Constants from 'expo-constants';

export const getGoogleMapsApiKey = () => {
  return Constants.manifest?.extra?.googleMapsApiKey || '';
};
