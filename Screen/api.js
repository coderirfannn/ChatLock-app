import { Platform } from "react-native";

export const API_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  ios: 'http://localhost:8000',
  default: 'http://your-computer-ip:8000',
});