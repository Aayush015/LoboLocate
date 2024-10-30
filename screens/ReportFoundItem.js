import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasLibraryPermission, setHasLibraryPermission] = useState(false);
    const [image, setImage] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [locations, setLocations] = useState(["", "", "", ""]);
    const [distinguishingFeatures, setDistinguishingFeatures] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const itemTypes = ["Electronics", "Food", "Personal Item", "Clothing", "Accessory", "Others"];

    useEffect(() => {
        const checkPermissions = async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            setHasCameraPermission(cameraStatus === 'granted');
            setHasLibraryPermission(libraryStatus === 'granted');

            if (cameraStatus !== 'granted') {
                Alert.alert("Permission Denied", "Camera access is needed to take a picture of the found item.");
            }
            if (libraryStatus !== 'granted') {
                Alert.alert("Permission Denied", "Gallery access is needed to select an image.");
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

        if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
            setImage(result.assets[0].uri);
            generateDescription(result.assets[0].uri);
        } else {
            Alert.alert("Error", "Failed to take a picture. Please try again.");
            console.error("Camera result error:", result);
        }
    };

    const pickImage = async () => {
        if (!hasLibraryPermission) {
            Alert.alert("Gallery access needed", "Please enable gallery access in your device settings.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
            setImage(result.assets[0].uri);
            generateDescription(result.assets[0].uri);
        } else {
            Alert.alert("Error", "Failed to pick an image. Please try again.");
            console.error("Image picker result error:", result);
        }
    };

    const generateDescription = async (imageUri) => {
        setIsGenerating(true);
        if (!imageUri) {
            console.error("No image URI provided to generate description.");
            Alert.alert("Error", "No image URI found. Please try again.");
            setIsGenerating(false);
            return;
        }
    
        try {
            const base64Image = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
            const visionResponse = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCtRHU9YzETXXvqI9uoBTQPQX8yJB3FuoY`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requests: [
                            {
                                image: { content: base64Image },
                                features: [
                                    { type: 'LABEL_DETECTION', maxResults: 5 },
                                    { type: 'TEXT_DETECTION', maxResults: 15 }
                                ]
                            }
                        ]
                    })
                }
            );
    
            if (!visionResponse.ok) {
                const errorText = await visionResponse.text();
                console.error("Google Vision API error response:", errorText);
                Alert.alert("Error", "Could not generate description due to Vision API error. Please fill it manually.");
                setIsGenerating(false);
                return;
            }
    
            const visionData = await visionResponse.json();
            setIsGenerating(false);
    
            if (visionData.responses && visionData.responses[0]) {
                const labels = visionData.responses[0].labelAnnotations || [];
                const detectedTexts = visionData.responses[0].textAnnotations || [];
    
                // Extract main label and map to item type
                if (labels.length > 0) {
                    const mainLabel = labels[0].description.toLowerCase();
    
                    if (mainLabel.includes("electronics")) setItemType("Electronics");
                    else if (mainLabel.includes("food")) setItemType("Food");
                    else if (mainLabel.includes("clothing") || mainLabel.includes("apparel")) setItemType("Clothing");
                    else if (mainLabel.includes("accessory")) setItemType("Accessory");
                    else if (mainLabel.includes("personal")) setItemType("Personal Item");
                    else setItemType("Others");
    
                    // Populate distinguishing features with unique labels (up to 5, short form)
                    const distinguishingFeaturesText = labels.slice(0, 5).map(label => label.description).join(', ');
                    setDistinguishingFeatures(distinguishingFeaturesText);
    
                    // Generate a unique long description with full text annotations
                    let longDescriptionText = "";
                    if (detectedTexts.length > 0) {
                        // Limit to 15-20 words from the detailed description
                        longDescriptionText = detectedTexts[0].description.split(" ").slice(0, 20).join(" ");
                    } 
                    
                    // Fallback to label descriptions if text annotations are minimal
                    if (!longDescriptionText || longDescriptionText.split(" ").length < 10) {
                        longDescriptionText = labels.map(label => label.description).join(", ");
                    }
                    
                    setLongDescription(longDescriptionText);
                } else {
                    Alert.alert("Error", "No descriptive labels were found. Please fill manually.");
                }
            } else {
                Alert.alert("Error", "No responses from Vision API. Please fill manually.");
            }
        } catch (error) {
            setIsGenerating(false);
            console.error("Failed to generate description:", error.message);
            Alert.alert("Error", "Failed to connect to Vision API. Please check your internet connection and API key.");
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
            longDescription,
        });
    };

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <ScrollView>
                <FormContainer>
                    <StyledButton onPress={openCamera}>
                        <ButtonText>Take Picture of Found Item</ButtonText>
                    </StyledButton>
                    <StyledButton onPress={pickImage}>
                        <ButtonText>Choose Image of Found Item</ButtonText>
                    </StyledButton>

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

export default ReportFoundItem;
