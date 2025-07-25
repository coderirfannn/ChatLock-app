import React, { useState } from 'react';

import {
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');
import logo from '../../../../assets/lo.png';
const Signup_AccountCreated = ({navigation}) => {
  return (
       <View style={styles.container}>
      <Image 
        source={logo} // Change this to your own image path
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Account Created!</Text>
      <Text style={styles.subtext}>Welcome to ChatLock. You're all set to start chatting.</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Mainpages')} // Change to your login/home screen
      >
        <Text style={styles.buttonText}>Welcome</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Signup_AccountCreated

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  }
});