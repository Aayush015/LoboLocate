import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

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

const ReportFoundItem = ({ navigation }) => {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [autoDescription, setAutoDescription] = useState("");
    const [itemType, setItemType] = useState(null);
    const [locations, setLocations] = useState(["", "", "", ""]);
    const [distinguishingFeatures, setDistinguishingFeatures] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const itemTypes = ["Electronics", "Food", "Personal Item", "Clothing", "Accessory", "Others"];

    // Request camera permissions on load
    useEffect(() => {
        const checkPermissions = async () => {
            const { status } = await Camera.getCameraPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
                setHasCameraPermission(newStatus === 'granted');
                if (newStatus !== 'granted') {
                    Alert.alert("Permission Denied", "Camera access is needed to take a picture of the found item.");
                }
            } else {
                setHasCameraPermission(true);
            }
        };
        checkPermissions();
    }, []);

    const openCamera = async () => {
        if (!hasCameraPermission) {
            Alert.alert("Camera access needed", "Please enable camera access in your device settings.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        
        if (!result.cancelled) {
            setImage(result.uri);
            generateDescription(result.uri);
        }
    };

    const generateDescription = async (imageUri) => {
        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: imageUri,
                name: 'found_item.jpg',
                type: 'image/jpeg',
            });

            const response = await fetch("https://your-backend-endpoint.com/generate-description", {
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            setIsGenerating(false);

            if (data.description) {
                setAutoDescription(data.description);
            } else {
                Alert.alert("Error", "Could not generate description. Please fill it manually.");
            }
        } catch (error) {
            setIsGenerating(false);
            Alert.alert("Error", "Failed to generate description. Please fill it manually.");
        }
    };

    const handleSelectItemType = (type) => {
        setItemType(type);
    };

    const handleLocationChange = (index, value) => {
        const updatedLocations = [...locations];
        updatedLocations[index] = value;
        setLocations(updatedLocations);
    };

    const handleSubmit = () => {
        console.log({
            image,
            itemType,
            locations,
            distinguishingFeatures,
            longDescription: longDescription || autoDescription,
        });
    };

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <ScrollView>
                <FormContainer>
                    {image ? (
                        <>
                            <QuestionLabel>Auto-Generated Description</QuestionLabel>
                            {isGenerating ? (
                                <ActivityIndicator size="large" color={colors.brand} />
                            ) : (
                                <StyledTextArea
                                    value={autoDescription}
                                    onChangeText={setLongDescription}
                                    multiline={true}
                                />
                            )}
                        </>
                    ) : (
                        <StyledButton onPress={openCamera}>
                            <ButtonText>Take Picture of Found Item</ButtonText>
                        </StyledButton>
                    )}

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

                    <QuestionLabel>Possible Locations (up to 4)</QuestionLabel>
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
                        value={longDescription || autoDescription}
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

export default ReportFoundItem;