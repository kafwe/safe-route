import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types'; // Ensure this path is correct

type NotFoundScreenNavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;

const NotFoundScreen: React.FC = () => {
  const navigation = useNavigation<NotFoundScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>404 - Screen Not Found</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default NotFoundScreen;
