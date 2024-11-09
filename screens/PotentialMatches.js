import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io("https://intense-earth-59719-22401d6fbb13.herokuapp.com/item/chat/"); // Connect to the Socket.IO server

const PotentialMatches = ({ route, navigation }) => {
    const { userId } = route.params || {};
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [currentChatUser, setCurrentChatUser] = useState(null);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get(`https://intense-earth-59719-22401d6fbb13.herokuapp.com/item/potentialMatches/${userId}`);
                
                const matchesData = await Promise.all(response.data.map(async (match) => {
                    try {
                        const foundUserId = match.foundItem.userId;
                        const userUrl = `https://intense-earth-59719-22401d6fbb13.herokuapp.com/user/${foundUserId}`;
                        
                        const userResponse = await axios.get(userUrl);
                        
                        if (userResponse.data.status === 'SUCCESS') {
                            const foundUserData = userResponse.data.data;
                            return { ...match, foundUserData };
                        } else {
                            console.warn("Failed to fetch user data:", userResponse.data.message);
                            return { ...match, foundUserData: null };
                        }
                    } catch (userError) {
                        console.error("Error fetching found user data:", userError);
                        return { ...match, foundUserData: null };
                    }
                }));
                setMatches(matchesData);
            } catch (error) {
                console.error("Error fetching potential matches:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchMatches();
    
        const interval = setInterval(fetchMatches, 10000);
    
        return () => clearInterval(interval);
    
    }, [userId]);

    const handleChat = (foundUserId, itemId) => {
        setCurrentChatUser(foundUserId);
        setCurrentItemId(itemId);
        setChatModalVisible(true);
        fetchChatHistory(itemId);
    };

    const fetchChatHistory = async (itemId) => {
        try {
            const response = await axios.get(`https://intense-earth-59719-22401d6fbb13.herokuapp.com/item/chat/${itemId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    useEffect(() => {
        // Listen for real-time messages for the specific item chat
        socket.on(`message:${currentItemId}`, (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off(`message:${currentItemId}`);
        };
    }, [currentItemId]);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                senderId: userId,
                receiverId: currentChatUser,
                itemId: currentItemId,
                message,
            };

            // Emit the message via Socket.IO
            socket.emit('sendMessage', newMessage);
            setMessage(''); // Clear input field
        } else {
            Alert.alert("Empty Message", "Please enter a message before sending.");
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => Alert.alert("Match Details", `Match Score: ${Math.round(item.matchScore * 100)}%\nDistinguishing Features: ${item.foundItem.distinguishingFeatures || "N/A"}`)}
        >
            <Text style={styles.itemTitle}>Lost Item: {item.lostItem.itemType || "Unknown"}</Text>
            <Text>Found by: {item.foundUserData?.name || "Unknown"}</Text>
            <Text>Email: {item.foundUserData?.email || "N/A"}</Text>
            <Text>Found Item: {item.foundItem.itemType || "Unknown"}</Text>
            <Text>Match Score: {Math.round(item.matchScore * 100)}%</Text>
            <Text>Distinguishing Features: {item.foundItem.distinguishingFeatures || "N/A"}</Text>
            
            <View style={styles.chatBox}>
                <TouchableOpacity style={styles.chatButton} onPress={() => handleChat(item.foundItem.userId, item.foundItem._id)}>
                    <Text style={styles.chatButtonText}>Chat with Finder</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading matches...</Text>
            ) : (
                <FlatList
                    data={matches}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text style={styles.noMatchesText}>No potential matches found.</Text>}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={chatModalVisible}
                onRequestClose={() => setChatModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chat with Finder</Text>
                        <ScrollView style={styles.messageList}>
                            {messages.map((msg, index) => (
                                <View key={index} style={styles.messageContainer}>
                                    <Text style={styles.messageAuthor}>{msg.senderId.name}:</Text>
                                    <Text style={styles.messageText}>{msg.message}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your message here..."
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <Button title="Send Message" onPress={sendMessage} />
                        <Button title="Close" color="red" onPress={() => setChatModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 100,  
        backgroundColor: '#f0f0f5',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#555',
    },
    noMatchesText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#555',
    },
    itemContainer: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    chatBox: {
        marginTop: 15,
        alignItems: 'center',
    },
    chatButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        margin: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    messageList: {
        height: 200,
        width: '100%',
        marginBottom: 15,
    },
    messageContainer: {
        marginBottom: 8,
    },
    messageAuthor: {
        fontWeight: 'bold',
    },
    messageText: {
        fontSize: 16,
    },
});

export default PotentialMatches;