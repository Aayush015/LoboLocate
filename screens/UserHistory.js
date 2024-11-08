import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

const UserHistory = ({ route, navigation }) => {
    const { userId } = route.params;
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`https://intense-earth-59719-22401d6fbb13.herokuapp.com/item/history/${userId}`);
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching user history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId]);

    const handleDelete = async (itemId) => {
        try {
            console.log("Deleting item with ID:", itemId);
            const response = await axios.delete(`https://intense-earth-59719-22401d6fbb13.herokuapp.com/item/delete/${itemId}`);
            if (response.status === 200) {
                Alert.alert('Success', 'Item deleted successfully');
                setHistory(history.filter(item => item._id !== itemId));
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            Alert.alert('Error', 'Could not delete the item. Please try again.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDelete(item._id)}>
                <FontAwesome name="trash" size={20} color="#d9534f" />
            </TouchableOpacity>
            <Text style={styles.itemTitle}>{item.itemType || 'Item'}</Text>
            <Text>Status: {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown'}</Text>
            <Text>Date: {item.dateLost ? new Date(item.dateLost).toLocaleDateString() : 'N/A'}</Text>
            <Text>Location: {item.knownLocation || 'N/A'}</Text>
            <Text>Details: {item.longDescription || 'No additional details provided.'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading history...</Text>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text style={styles.noHistoryText}>No history available.</Text>}
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
    noHistoryText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#555',
    },
    itemContainer: {
        position: 'relative',
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
    deleteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
});

export default UserHistory;