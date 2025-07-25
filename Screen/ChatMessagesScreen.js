import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { UserType } from "../UseContext";

const API_URL = Platform.select({
  android: "http://10.0.2.2:8000",
  ios: "http://localhost:8000",
  default: "http://localhost:8000",
});

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { recepientId } = route.params;
  const [message, setMessage] = useState("");
  const { userId } = useContext(UserType);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/messages/${userId}/${recepientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.log("Error fetching messages:", error.message);
      Alert.alert(
        "Connection Error",
        "Could not load messages. Please check your connection.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(`${API_URL}/user/${recepientId}`);
        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log("Error retrieving details", error);
      }
    };
    fetchRecepientData();
  }, []);

const handleSend = async (messageType, imageUri = null) => {
  if (isSending) return;
  setIsSending(true);

  try {
    // Validate recipientId exists and is valid
    if (!recepientId || typeof recepientId !== 'string') {
      throw new Error("Recipient not selected");
    }

    if (messageType === "text" && !message.trim()) {
      return;
    }

    const formData = new FormData();
    formData.append("senderId", userId);
    formData.append("recepientId", recepientId); // Make sure this is correct
    formData.append("messageType", messageType);

    // Rest of your send logic...
  } catch (error) {
    console.log("Error in sending the message:", error.message);
    Alert.alert(
      "Message Failed",
      error.message || "Could not send message. Please try again.",
      [{ text: "OK" }]
    );
  } finally {
    setIsSending(false);
  }
};

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch(`${API_URL}/deleteMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.ok) {
        setSelectedMessages((prev) => prev.filter((id) => !messageIds.includes(id)));
        fetchMessages();
      } else {
        throw new Error("Failed to delete messages");
      }
    } catch (error) {
      console.log("Error deleting messages", error);
      Alert.alert("Error", "Failed to delete messages. Please try again.");
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    try {
      const options = {
        mediaType: "photo",
        quality: 1,
        includeBase64: false,
      };
      
      const result = await launchImageLibrary(options);
      
      if (result.didCancel) return;
      
      if (result.errorCode) {
        throw new Error(result.errorMessage || "Image picker error");
      }
      
      if (result.assets?.[0]?.uri) {
        await handleSend("image", result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleSelectMessage = (message) => {
    const isSelected = selectedMessages.includes(message._id);
    setSelectedMessages(isSelected
      ? prev => prev.filter(id => id !== message._id)
      : prev => [...prev, message._id]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          {selectedMessages.length > 0 ? (
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {selectedMessages.length}
            </Text>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{ width: 30, height: 30, borderRadius: 15 }}
                source={{ uri: recepientData?.image }}
              />
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () => selectedMessages.length > 0 && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
          <Ionicons name="md-arrow-undo" size={24} color="black" />
          <FontAwesome name="star" size={24} color="black" />
          <MaterialIcons
            onPress={() => deleteMessages(selectedMessages)}
            name="delete"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, [recepientData, selectedMessages]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: "#F0F0F0" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((item, index) => {
            const isSelected = selectedMessages.includes(item._id);
            const isSent = item.senderId?._id === userId;
            const messageStyle = isSent ? styles.sentMessage : styles.receivedMessage;
            
            return (
              <Pressable
                key={index}
                onLongPress={() => handleSelectMessage(item)}
                style={[messageStyle, isSelected && { backgroundColor: "#F0FFFF" }]}
              >
                {item.messageType === "image" ? (
                  <>
                    <Image
                      source={{ uri: `${API_URL}${item.imageUrl}` }}
                      style={{ width: 200, height: 200, borderRadius: 7 }}
                    />
                    <Text style={styles.imageTimeText}>
                      {formatTime(item.timeStamp)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 13 }}>{item.message}</Text>
                    <Text style={styles.timeText}>
                      {formatTime(item.timeStamp)}
                    </Text>
                  </>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <Entypo
          onPress={handleEmojiPress}
          name="emoji-happy"
          size={24}
          color="gray"
          style={{ marginRight: 5 }}
        />
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholder="Type Your message..."
          multiline
          editable={!isSending}
        />
        <View style={styles.icons}>
          <Entypo 
            onPress={pickImage} 
            name="camera" 
            size={24} 
            color="gray" 
            disabled={isSending}
          />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable 
          onPress={() => handleSend("text")} 
          style={[
            styles.sendButton, 
            (!message.trim() || isSending) && styles.disabledButton
          ]}
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
          )}
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage(prev => prev + emoji);
            setShowEmojiSelector(false);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 8,
    maxWidth: "60%",
    borderRadius: 7,
    margin: 10,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    padding: 8,
    maxWidth: "60%",
    borderRadius: 7,
    margin: 10,
  },
  timeText: {
    textAlign: "right",
    fontSize: 9,
    color: "gray",
    marginTop: 5,
  },
  imageTimeText: {
    position: "absolute",
    right: 10,
    bottom: 7,
    fontSize: 9,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 2,
    borderRadius: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: Platform.OS === "ios" ? 25 : 5,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatMessagesScreen;