import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
    const [locations, setLocations] = useState(["", "", ""]);
    const [distinguishingFeatures, setDistinguishingFeatures] = useState("");
    const [longDescription, setLongDescription] = useState("");

    const itemTypes = ["Electronics", "Food", "Personal Item", "Clothing", "Accessory", "Others"];

    const handleSelectItemType = (type) => {
        setItemType(type);
    };

    const handleLocationChange = (index, value) => {
        const updatedLocations = [...locations];
        updatedLocations[index] = value;
        setLocations(updatedLocations);
    };

    const handleSubmit = () => {
        // Handle form submission logic
        console.log({
            itemType,
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
                    <QuestionLabel>Item Type</QuestionLabel>
                    <MultiChoiceContainer>
                        {itemTypes.map((type) => (
                            <ChoiceButton
                                key={type}
                                onPress={() => handleSelectItemType(type)}
                                style={{
                                    backgroundColor: itemType === type ? colors.brand : colors.secondary,
                                }}
                            >
                                <ChoiceButtonText>{type}</ChoiceButtonText>
                            </ChoiceButton>
                        ))}
                    </MultiChoiceContainer>

                    <QuestionLabel>Possible Locations (up to 3)</QuestionLabel>
                    {locations.map((location, index) => (
                        <StyledTextInput
                            key={index}
                            placeholder={`Location ${index + 1}`}
                            value={location}
                            onChangeText={(text) => handleLocationChange(index, text)}
                        />
                    ))}

                    <QuestionLabel>Description of Distinguishing Features</QuestionLabel>
                    <StyledTextInput
                        placeholder="E.g., color, size, unique markings"
                        value={distinguishingFeatures}
                        onChangeText={setDistinguishingFeatures}
                    />

                    <QuestionLabel>Long Description (Optional)</QuestionLabel>
                    <StyledTextArea
                        placeholder="Provide additional details if necessary"
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