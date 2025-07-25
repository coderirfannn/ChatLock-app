import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import { UserType } from '../UseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../decodeToken';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import { API_URL } from './api';


const COLORS = {
  primary: '#4361ee',
  secondary: '#3a0ca3',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2b2d42',
  textLight: '#8d99ae',
  accent: '#4cc9f0',
  border: '#e9ecef',
  error: '#ef233c',
  success: '#4caf50'
};



const Home = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateYAnim = useState(new Animated.Value(30))[0];
  const [requestStatuses, setRequestStatuses] = useState({});

  // Header configuration
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>ChatLock</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Chats')}
            activeOpacity={0.7}
          >
            
            <Entypo name="chat" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Friends')}
            activeOpacity={0.7}
          >
            <Ionicons name="people-sharp" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: COLORS.card,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    });
  }, [navigation]);

  // Animation setup
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fetch users with proper error handling
  const fetchUsers = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Authentication Required', 'Please login again');
        navigation.navigate('Login');
        return;
      }

      const decoded = decodeToken(token);
      const extractedUserId = decoded?.userId;
      if (!extractedUserId) {
        throw new Error('Invalid token payload');
      }

      setUserId(extractedUserId);

      const response = await fetch(`${API_URL}/users/${extractedUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      Alert.alert(
        'Error', 
        err.message || 'Failed to load users. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, [fetchUsers]);

  // Improved friend request function
  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      if (requestStatuses[selectedUserId] === 'sending') return;

      setRequestStatuses(prev => ({
        ...prev,
        [selectedUserId]: 'sending'
      }));

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          senderId: currentUserId,
          recipientId: selectedUserId
        })
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || 'Request processed' };
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      setRequestStatuses(prev => ({
        ...prev,
        [selectedUserId]: 'sent'
      }));

      // Update local users state to reflect the change
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === selectedUserId 
            ? { ...user, hasPendingRequest: true } 
            : user
        )
      );

    } catch (error) {
      console.error('Friend request error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send request',
        [{ text: 'OK' }]
      );
    } finally {
      setRequestStatuses(prev => ({
        ...prev,
        [selectedUserId]: undefined
      }));
    }
  };


const handleLogout = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
      // Optional: Call backend logout if required
      await axios.post(`${API_URL}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.removeItem("authToken"); // ✅ Remove token
      console.log("Logged out and token removed");

      // ✅ Navigate to Login and reset stack
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } else {
      console.warn("No token found in storage.");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  } catch (error) {
    console.error("Logout Error:", error);
    Alert.alert("Logout Failed", "Something went wrong during logout.");
  }
};


  // Debounced search filtering
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <Animated.ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          <Animated.View
            style={[
              styles.searchContainer,
              { transform: [{ translateY: translateYAnim }] }
            ]}
          >
            <MaterialIcons
              name="search"
              size={22}
              color={COLORS.textLight}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            )}
          </Animated.View>

          <View style={styles.chatList}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <Animated.View
                  key={user._id}
                  style={[
                    styles.chatItem,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: Animated.multiply(
                            translateYAnim,
                            new Animated.Value(1 - index * 0.1)
              )}
                      ]
                    }
                  ]}
                >
                  <View style={styles.chatItemInner}>
                    <View style={styles.avatar}>
                      {user.image ? (
                        <Image
                          source={{ uri: user.image }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarText}>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                      )}
                    </View>
                    <View style={styles.chatContent}>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatName} numberOfLines={1}>
                          {user?.name || 'Unnamed User'}
                        </Text>
                        <TouchableOpacity
                          onPress={() => sendFriendRequest(userId, user._id)}
                          disabled={user.hasPendingRequest || requestStatuses[user._id] === 'sending'}
                          style={[
                            styles.requestButton,
                            (user.hasPendingRequest || requestStatuses[user._id] === 'sent') && styles.sentButton,
                            requestStatuses[user._id] === 'sending' && styles.sendingButton
                          ]}
                        >
                          {requestStatuses[user._id] === 'sending' ? (
                            <ActivityIndicator color="#fff" size="small" />
                          ) : user.hasPendingRequest ? (
                            <Text style={styles.buttonText}>Request Sent</Text>
                          ) : (
                            <Text style={styles.buttonText}>Add Friend</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.chatMessage} numberOfLines={1}>
                        {user.email}
                      </Text>

                      <Text onPress={handleLogout}>Logout</Text>
                    </View>
                  </View>
                </Animated.View>
              ))
            ) : (
              <Animated.View
                style={[
                  styles.emptyState,
                  { opacity: fadeAnim }
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={60}
                  color={COLORS.textLight}
                />
                <Text style={styles.emptyStateText}>
                  {searchQuery ? 'No matching users found' : 'No users available'}
                </Text>
                <TouchableOpacity
                  onPress={onRefresh}
                  style={styles.refreshButton}
                >
                  <Text style={styles.refreshText}>Try Again</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerLeft: {
    paddingLeft: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingRight: 16,
  },
  headerIcon: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  chatList: {
    gap: 12,
  },
  chatItem: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  chatItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary + '20',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    maxWidth: '60%',
  },
  chatMessage: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  refreshText: {
    color: 'white',
    fontWeight: '600',
  },
  requestButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  sentButton: {
    backgroundColor: COLORS.secondary,
  },
  sendingButton: {
    backgroundColor: COLORS.textLight,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default Home;