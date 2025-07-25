import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "./Screen/LoginSignup/Signup/Register";
import Login from "./Screen/LoginSignup/Login/login";
import Home from "./Screen/Home";
import FriendsScreen from "./Screen/FriendsScreen";
import ChatMessagesScreen from "./Screen/ChatMessagesScreen";
import ChatsScreen from "./Screen/ChatsScreen";


const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
         <Stack.Screen name="Home" component={Home}  />

         <Stack.Screen name="Friends" component={FriendsScreen} />

        <Stack.Screen name="Chats" component={ChatsScreen} />

        <Stack.Screen name="Messages" component={ChatMessagesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});