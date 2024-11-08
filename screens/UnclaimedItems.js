import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

const UnclaimedItems = ({ navigation }) => {
    const [unclaimedItems, setUnclaimedItems] = useState([
        { id: '1', category: 'Electronics', itemType: 'Smartphone', status: 'Unclaimed', dateLost: '2023-08-12', knownLocation: 'Library', details: 'Black iPhone with cracked screen', icon: 'mobile' },
        { id: '2', category: 'Clothing', itemType: 'Jacket', status: 'Unclaimed', dateLost: '2023-07-29', knownLocation: 'Gym', details: 'Blue Adidas jacket', icon: 'shopping-bag' },
        { id: '3', category: 'Accessories', itemType: 'Sunglasses', status: 'Unclaimed', dateLost: '2023-06-15', knownLocation: 'Cafeteria', details: 'Ray-Ban aviator sunglasses', icon: 'eyewear' },
        { id: '4', category: 'Personal Items', itemType: 'Wallet', status: 'Unclaimed', dateLost: '2023-05-10', knownLocation: 'Parking Lot', details: 'Brown leather wallet with ID cards', icon: 'wallet' },
        { id: '5', category: 'Household Items', itemType: 'Book', status: 'Unclaimed', dateLost: '2023-04-20', knownLocation: 'Library', details: 'Hardcover copy of "1984" by George Orwell', icon: 'book' },
        { id: '6', category: 'Sports and Outdoor Gear', itemType: 'Bicycle', status: 'Unclaimed', dateLost: '2023-04-15', knownLocation: 'Bike Rack', details: 'Red mountain bike, minor scratches', icon: 'bike' },
        { id: '7', category: 'Pet Items', itemType: 'Collar', status: 'Unclaimed', dateLost: '2023-07-01', knownLocation: 'Dog Park', details: 'Blue collar with bell', icon: 'paw' },
        { id: '8', category: 'Miscellaneous', itemType: 'Umbrella', status: 'Unclaimed', dateLost: '2023-05-28', knownLocation: 'Library Entrance', details: 'Black foldable umbrella', icon: 'umbrella' },
        { id: '9', category: 'Electronics', itemType: 'Laptop', status: 'Unclaimed', dateLost: '2023-08-02', knownLocation: 'Library Study Room', details: 'Gray Dell laptop', icon: 'laptop' },
        { id: '10', category: 'Personal Items', itemType: 'Keys', status: 'Unclaimed', dateLost: '2023-06-22', knownLocation: 'Parking Lot', details: 'Set of car keys with blue keychain', icon: 'key' }
    ]);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.iconContainer}>
                {item.icon === 'mobile' && <FontAwesome name="mobile" size={24} color="#666" />}
                {item.icon === 'shopping-bag' && <FontAwesome name="shopping-bag" size={24} color="#666" />}
                {item.icon === 'eyewear' && <MaterialIcons name="remove-red-eye" size={24} color="#666" />} 
                {item.icon === 'wallet' && <Ionicons name="wallet-outline" size={24} color="#666" />}
                {item.icon === 'book' && <FontAwesome name="book" size={24} color="#666" />}
                {item.icon === 'bike' && <FontAwesome name="bicycle" size={24} color="#666" />}
                {item.icon === 'paw' && <Ionicons name="paw-outline" size={24} color="#666" />}
                {item.icon === 'umbrella' && <FontAwesome name="umbrella" size={24} color="#666" />}
                {item.icon === 'laptop' && <FontAwesome name="laptop" size={24} color="#666" />}
                {item.icon === 'key' && <FontAwesome name="key" size={24} color="#666" />}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.itemType}</Text>
                <Text style={styles.text}>Status: {item.status}</Text>
                <Text style={styles.text}>Date: {item.dateLost ? new Date(item.dateLost).toLocaleDateString() : 'N/A'}</Text>
                <Text style={styles.text}>Location: {item.knownLocation || 'N/A'}</Text>
                <Text style={styles.detailsText}>Details: {item.details || 'No additional details provided.'}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={unclaimedItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.noItemsText}>No unclaimed items available.</Text>}
            />
            <Text style={styles.footerText}>
                All unclaimed items are held at Lost & Found, Hokona Hall, 2500 Campus Blvd NE, and are subject to rules by the UNM Lost and Found department.
                These are items that have been on Lost not claimed by the owner for more than 90 days.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
        paddingTop: 100,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    textContainer: {
        flex: 1, 
        flexShrink: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    text: {
        fontSize: 14,
        color: '#666',
    },
    detailsText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        flexShrink: 1, 
    },
    noItemsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
        marginTop: 20,
    },
});

export default UnclaimedItems;