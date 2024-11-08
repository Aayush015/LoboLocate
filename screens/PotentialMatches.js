import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const PotentialMatches = ({ route, navigation }) => {
    const { userId } = route.params || {};
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get(`https://intense-earth-59719-22401d6fbb13.herokuapp.com/item/potentialMatches/${userId}`);
                
                const matchesData = await Promise.all(response.data.map(async (match) => {
                    try {
                        // URL construction for clarity
                        const foundUserId = match.foundItem.userId;
                        const userUrl = `https://intense-earth-59719-22401d6fbb13.herokuapp.com/user/${foundUserId}`;
                        
                        // Fetching the found user's data
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

    const handleChat = (otherUserId) => {
        navigation.navigate('Chat', { userId, otherUserId });
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
                <TouchableOpacity style={styles.chatButton} onPress={() => handleChat(item.foundItemUserId)}>
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
});

export default PotentialMatches;