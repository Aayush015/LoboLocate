import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
    StyledContainer,
    FormContainer,
    QuestionLabel,
    MultiChoiceContainer,
    ChoiceButton,
    ChoiceButtonText,
    StyledTextInput,
    StyledTextArea,
    StyledButton,
    ButtonText,
    colors,
} from '../components/styles';

const ReportLostItem = ({ navigation }) => {
    const [itemType, setItemType] = useState(null);
    const [dateLost, setDateLost] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [locationKnown, setLocationKnown] = useState(null);
    const [locations, setLocations] = useState(["", "", ""]);
    const [knownLocation, setKnownLocation] = useState("");
    const [distinguishingFeatures, setDistinguishingFeatures] = useState("");
    const [longDescription, setLongDescription] = useState("");

    const itemTypes = [
        "Electronics",
        "Clothing",
        "Accessories",
        "Personal Items",
        "Household Items",
        "Sports and Outdoor Gear",
        "Pet Items",
        "Miscellaneous",
    ];

    const handleLocationChange = (index, value) => {
        const updatedLocations = [...locations];
        updatedLocations[index] = value;
        setLocations(updatedLocations);
    };

    const handleSubmit = () => {
        // Ensure all required fields are filled
        if (!itemType || !dateLost || (locationKnown === null) || (locationKnown && !knownLocation) || (!locationKnown && locations.every(location => location === "")) || !distinguishingFeatures) {
            alert("Please fill out all required fields marked with *.");
            return;
        }

        // Handle form submission logic
        console.log({
            itemType,
            dateLost,
            locationKnown,
            knownLocation,
            locations,
            distinguishingFeatures,
            longDescription,
        });
    };

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <ScrollView>
                <FormContainer>
                    <QuestionLabel>Item Type *</QuestionLabel>
                    <Picker
                        selectedValue={itemType}
                        onValueChange={(itemValue) => setItemType(itemValue)}
                        style={{ backgroundColor: colors.secondary, marginBottom: 10 }}
                    >
                        <Picker.Item label="Select an item type" value={null} />
                        {itemTypes.map((type, index) => (
                            <Picker.Item key={index} label={type} value={type} />
                        ))}
                    </Picker>

                    <QuestionLabel>Date Item was Lost *</QuestionLabel>
                    <StyledButton onPress={() => setShowDatePicker(true)}>
                        <ButtonText>Select Date</ButtonText>
                    </StyledButton>
                    {showDatePicker && (
                        <DateTimePicker
                            value={dateLost}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate && selectedDate <= new Date()) {
                                    setDateLost(selectedDate);
                                } else if (selectedDate > new Date()) {
                                    alert("Date cannot be in the future.");
                                }
                            }}
                        />
                    )}
                    <QuestionLabel>Date Selected: {dateLost.toDateString()}</QuestionLabel>

                    <QuestionLabel>Location Known? *</QuestionLabel>
                    <MultiChoiceContainer>
                        <ChoiceButton
                            onPress={() => setLocationKnown(true)}
                            style={{ backgroundColor: locationKnown === true ? colors.brand : colors.secondary }}
                        >
                            <ChoiceButtonText>Yes</ChoiceButtonText>
                        </ChoiceButton>
                        <ChoiceButton
                            onPress={() => setLocationKnown(false)}
                            style={{ backgroundColor: locationKnown === false ? colors.brand : colors.secondary }}
                        >
                            <ChoiceButtonText>No</ChoiceButtonText>
                        </ChoiceButton>
                    </MultiChoiceContainer>

                    {locationKnown === true && (
                        <StyledTextInput
                            placeholder="Enter known location"
                            value={knownLocation}
                            onChangeText={setKnownLocation}
                        />
                    )}

                    {locationKnown === false && (
                        <>
                            <QuestionLabel>Possible Locations (up to 3) *</QuestionLabel>
                            {locations.map((location, index) => (
                                <StyledTextInput
                                    key={index}
                                    placeholder={`Location ${index + 1}`}
                                    value={location}
                                    onChangeText={(text) => handleLocationChange(index, text)}
                                />
                            ))}
                        </>
                    )}

                    <QuestionLabel>Item Name *</QuestionLabel>
                    <StyledTextInput
                        placeholder="E.g., phone, jacket, keys, ID"
                        value={distinguishingFeatures}
                        onChangeText={setDistinguishingFeatures}
                    />

                    <QuestionLabel>Long Description</QuestionLabel>
                    <StyledTextArea
                        placeholder="E.g., color, size, unique markings separated by comma"
                        value={longDescription}
                        onChangeText={setLongDescription}
                        multiline={true}
                    />

                    <StyledButton onPress={handleSubmit}>
                        <ButtonText>Submit Report</ButtonText>
                    </StyledButton>
                </FormContainer>
            </ScrollView>
        </StyledContainer>
    );
};

export default ReportLostItem;
