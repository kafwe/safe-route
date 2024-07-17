import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';

interface Route {
  duration: string;
  distance: string;
  summary: string;
  polyline: string;
}

interface RouteDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: () => void;
  route: Route | null;
}

const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({ visible, onClose, onNavigate, route }) => {
  if (!route) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            source={require('../navigation/Safe.png')} // Ensure the asset is in the correct path
            style={styles.icon}
          />
          <Text style={tw`text-lg font-bold mb-2`}>{route.summary}</Text>
          <TouchableOpacity style={styles.button} onPress={onNavigate}>
            <Text style={tw`text-white text-center text-lg font-bold`}>Navigate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default RouteDetailsModal;
