import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const PotentialMatches = ({ route }) => {
    const { userId } = route.params;
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/item/potentialMatches/${userId}`);
                setMatches(response.data);
            } catch (error) {
                console.error("Error fetching potential matches:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [userId]);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Lost Item: {item.lostItem.itemType}</Text>
            <Text>Found Item: {item.foundItem.itemType}</Text>
            <Text>Match Score: {Math.round(item.matchScore * 100)}%</Text>
            <Text>Distinguishing Features: {item.foundItem.distinguishingFeatures}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading matches...</Text>
            ) : (
                <FlatList
                    data={matches}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text>No potential matches found.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9'
    },
    itemContainer: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    }
});

export default PotentialMatches;