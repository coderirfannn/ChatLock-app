import { StyleSheet, Text, View, FlatList, Platform, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserType } from '../UseContext';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './api';



const ChatsScreen = () => {
  const { userId } = useContext(UserType);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Validate userId before making the request
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const response = await axios.get(`${API_URL}/friends-with-details/${userId}`);
        
        // Validate response data
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid friends data received');
        }

        setFriends(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setError(err.message || 'Failed to load friends');
        Alert.alert(
          'Error',
          'Could not load your friends list. Please try again later.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();

    // Cleanup function
    return () => {
      // Cancel any pending requests if component unmounts
      axios.CancelToken.source().cancel('Component unmounted');
    };
  }, [userId]);

  const navigateToChat = (friend) => {
    if (!friend?._id) {
      Alert.alert('Error', 'Invalid friend selected');
      return;
    }

    navigation.navigate('Messages', {
      recepientId: friend._id,
      recepientName: friend.name,
      recepientImage: friend.image
    });
  };

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.friendItem} 
      onPress={() => navigateToChat(item)}
    >
      <View style={styles.avatar}>
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.avatarImage} 
            onError={() => console.log('Failed to load avatar')}
          />
        ) : (
          <Text style={styles.avatarText}>
            {item.name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        )}
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName} numberOfLines={1}>
          {item.name || 'Unknown User'}
        </Text>
        <Text style={styles.friendStatus} numberOfLines={1}>
          {item.lastSeen 
            ? `Last seen: ${new Date(item.lastSeen).toLocaleString()}` 
            : 'Offline'
          }
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading your chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchFriends();
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.noFriendsText}>You don't have any friends yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item._id}
        renderItem={renderFriendItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.noFriendsText}>No friends found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  noFriendsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
  },
  friendStatus: {
    fontSize: 12,
    color: '#666',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatsScreen;