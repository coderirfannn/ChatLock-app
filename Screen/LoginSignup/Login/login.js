import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import logo from '../../../assets/lo.png';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../../api';

const { width } = Dimensions.get('window');



const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);




useFocusEffect(
  useCallback(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.replace("Home");
        }
      } catch (error) {
        console.log("Login status check error", error);
      }
    };

    checkLoginStatus();
  }, [])
);


  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert("Error", "Please fill in both email and password");
  //     return;
  //   }

  //   if (!validateEmail(email)) {
  //     Alert.alert("Error", "Invalid email format");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(`${API_URL}/login`, {
  //       email: email.trim(),
  //       password,
  //     });

  //     Alert.alert("Login Successful", "Welcome back!", [
  //       { text: "OK", onPress: () => navigation.navigate("Home") },
  //     ]);

  //     // Optionally reset fields
  //     setEmail('');
  //     setPassword('');
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     let errorMessage = "Login failed. Please try again.";

  //     if (error.code === 'ECONNABORTED') {
  //       errorMessage = "Request timeout. Check your connection.";
  //     } else if (error.code === 'ERR_NETWORK') {
  //       errorMessage = "Network error. Cannot connect to server.";
  //     } else if (error.response?.status === 401) {
  //       errorMessage = "Invalid credentials. Please try again.";
  //     } else if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     }

  //     Alert.alert("Login Failed", errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


const handleLogin = async () => {
  const user = {
    email: email.trim(),
    password,
  };

  try {
    const response = await axios.post(`${API_URL}/login`, user);
    const token = response.data.token;

    if (token) {
      await AsyncStorage.setItem("authToken", token); // ✅ Wait for storage
      navigation.replace("Home");                     // ✅ Then navigate
    } else {
      Alert.alert("Login Error", "No token received from server");
    }
  } catch (error) {
    Alert.alert("Login Error", "Invalid email or password");
    console.log("Login Error", error);
  }
};




  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('ForgotPassword_EnterEmail')}
        >
          Forgot Password?
        </Text>

        <Text style={styles.linkText}>
          Don't have an account?{' '}
          <Text style={styles.linkAction} onPress={() => navigation.navigate('Register')}>
            Sign Up
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
    textAlign: 'center',
  },
  linkAction: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
