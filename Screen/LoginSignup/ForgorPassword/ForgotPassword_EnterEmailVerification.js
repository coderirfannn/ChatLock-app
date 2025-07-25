import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';

const { width } = Dimensions.get('window');

const ForgotPassword_EnterEmailVerification = ({ navigation }) => {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp.trim().length === 6) {
      navigation.navigate('ResetPassword'); // Change to your next screen
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Your Email</Text>
      <Text style={styles.subText}>
        Enter the 6-digit verification code we sent to your email.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#888"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ForgotPassword_ChoosePassord')}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword_EnterEmailVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 20,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    textAlign: 'center',
    letterSpacing: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  backText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
