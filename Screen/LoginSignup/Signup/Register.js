import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
  Dimensions
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import logo from '../../../assets/lo.png';
import { API_URL } from "../../api";

const { width } = Dimensions.get('window');





const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 8;

const RegisterScreen = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (!validateEmail(form.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!validatePassword(form.password)) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    if (form.image && !form.image.startsWith("http")) {
      Alert.alert("Warning", "Image should be a valid URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        ...form,
        image: form.image || undefined,
      });

      Alert.alert("Registration Successful", "You can now login to your account", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
      setForm({ email: "", name: "", password: "", image: "" });
    } catch (error) {
      console.error("Full error:", error);
      let errorMessage = "Registration failed. Please try again.";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Check your connection.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Cannot connect to server.";
      } else if (error.response?.status === 409) {
        errorMessage = "Email already exists.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Image source={logo} style={styles.logo} resizeMode="contain" />
        
        <Text style={styles.title}>Create Account 🚀</Text>
        <Text style={styles.subtitle}>Fill the form to register</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
          autoCapitalize="words"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Profile Image URL (Optional)"
          placeholderTextColor="#aaa"
          value={form.image}
          onChangeText={(text) => handleChange("image", text)}
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Already have an account?{" "}
          <Text style={styles.linkAction} onPress={() => navigation.navigate("Login")}>
            Login
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#EEF2FF",
  },
    logo: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 20,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  button: {
    width: "100%",
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 15,
  },
  linkAction: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
