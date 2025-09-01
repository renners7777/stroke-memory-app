import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, AppState } from 'react-native';
import { getCurrentUser, getMessages, sendMessage, subscribeToMessages, UserDocument, Message, databases } from '../../src/lib/appwrite';
import { Query } from 'appwrite';

const MESSAGES_COLLECTION_ID = "messages_table";
const USERS_COLLECTION_ID = "users";
const APPWRITE_DATABASE_ID = "68b213e7001400dc7f21";

const MessagingScreen = () => {
  const [currentUser, setCurrentUser] = useState<UserDocument | null>(null);
  const [companionUser, setCompanionUser] = useState<UserDocument | null>(null);
  const [shareableIdInput, setShareableIdInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch messages when companion is set
  useEffect(() => {
    if (currentUser && companionUser) {
      const fetchMessages = async () => {
        try {
          const fetchedMessages = await getMessages(currentUser.$id, companionUser.$id);
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [currentUser, companionUser]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser || !companionUser) return;

    const unsubscribe = subscribeToMessages((response: any) => {
        const newMessagePayload = response.payload;
        // Check if the message is part of the current conversation
        const isRelevant = 
            (newMessagePayload.senderID === currentUser.$id && newMessagePayload.receiverID === companionUser.$id) ||
            (newMessagePayload.senderID === companionUser.$id && newMessagePayload.receiverID === currentUser.$id);

        if (isRelevant) {
            setMessages(prevMessages => [...prevMessages, newMessagePayload]);
        }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser, companionUser]);
  
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

  const handleStartChat = async () => {
    if (shareableIdInput.trim() === '') return;
    try {
      const response = await databases.listDocuments<UserDocument>(
        APPWRITE_DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('shareable_id', shareableIdInput.trim())]
      );
      if (response.documents.length > 0) {
        setCompanionUser(response.documents[0]);
      } else {
        alert('User with this Shareable ID not found.');
      }
    } catch (error) {
      console.error('Error finding user:', error);
      alert('Failed to find user.');
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser || !companionUser) return;

    try {
      await sendMessage(currentUser.$id, companionUser.$id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.senderID === currentUser?.$id ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  if (!companionUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Start a Conversation</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter companion's Shareable ID"
          value={shareableIdInput}
          onChangeText={setShareableIdInput}
          autoCapitalize="none"
        />
        <Button title="Start Chat" onPress={handleStartChat} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.chattingWith}>Chatting with: {companionUser.name}</Text>
        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.$id}
            style={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            />
            <Button title="Send" onPress={handleSendMessage} />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chattingWith: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messagesList: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
});

export default MessagingScreen;