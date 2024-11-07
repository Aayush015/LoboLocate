import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PotentialMatches = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Potential Matches will be shown here.</Text>
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

export default PotentialMatches;