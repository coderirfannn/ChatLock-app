import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

const { width } = Dimensions.get('window');
import logo from '../../../../assets/lo.png';

const ForgotPassword_EnterEmail = ({ navigation }) => {
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Enter your email to receive a reset link.</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ForgotPassword_EnterEmailVerification')}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>
          <Text 
            style={styles.linkAction} 
            onPress={() => navigation.goBack()}
          >
            ⬅ Back
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword_EnterEmail;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    margin: 10
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 25,
    textAlign: 'center',
  },
  linkAction: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
