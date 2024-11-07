import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const History = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>User's Lost and Found History will be displayed here.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default History;