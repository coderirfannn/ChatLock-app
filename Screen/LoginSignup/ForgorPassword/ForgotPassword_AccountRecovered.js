import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');

import logo from '../../../../assets/lo.png';

const ForgotPassword_AccountRecovered = ({ navigation }) => {
  return (
    <View style={styles.container}>
         <Image source={logo} style={styles.logo} resizeMode="contain" />
 
      <Text style={styles.title}>Password Reset Successful</Text>
      <Text style={styles.subtitle}>
        Your account has been recovered. You can now log in with your new password.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')} // Replace 'Login' with your actual route
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword_AccountRecovered;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

    logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
});
