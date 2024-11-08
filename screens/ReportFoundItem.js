import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


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
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasLibraryPermission, setHasLibraryPermission] = useState(false);
    const [image, setImage] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [dateLost, setDateLost] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [locationKnown, setLocationKnown] = useState(null);
    const [locations, setLocations] = useState(["", "", ""]);
    const [knownLocation, setKnownLocation] = useState("");
    const [distinguishingFeatures, setDistinguishingFeatures] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [userId, setUserId] = useState(null);

    const itemTypes = ["Electronics", "Clothing", "Accessories", "Personal Items", "Household Items", "Sports and Outdoor Gear", "Pet Items", "Miscellaneous"];

    const itemCategoryMapping = {
        "Electronics": ["Smartphones", "Laptops", "Tablets", "Headphones", "Cameras", "Chargers", "Smartwatches", "Console"],
        "Clothing": ["Jackets", "Shirts", "Pants", "Dresses", "Sweaters", "Hats", "Scarves", "Shoes"],
        "Accessories": ["Bags", "Sunglasses", "Jewelry", "Belts", "Watches", "Wallets", "Accessories"],
        "Personal Items": ["Keys", "Wallets", "Eyeglasses", "Phone cases", "Personal hygiene items", "Medication", "Diaries"],
        "Household Items": ["Kitchen utensils", "Towels", "Bedding", "Decorative items", "Small appliances", "Books", "Candles"],
        "Sports and Outdoor Gear": ["Bicycles", "Sports balls", "Camping gear", "Fishing equipment", "Skateboards", "Fitness gear", "Water bottles"],
        "Pet Items": ["Collars and leashes", "Pet toys", "Food and water bowls", "Pet carriers", "Grooming supplies", "Blankets for pets"],
        "Miscellaneous": ["Umbrellas", "Notebooks", "Toys", "Travel bags", "Art supplies", "Craft items"]
    };

    useEffect(() => {
        const checkPermissions = async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            setHasCameraPermission(cameraStatus === 'granted');
            setHasLibraryPermission(libraryStatus === 'granted');

            if (cameraStatus !== 'granted') {
                Alert.alert("Permission Denied", "Camera access is needed to take a picture of the item.");
            }
            if (libraryStatus !== 'granted') {
                Alert.alert("Permission Denied", "Gallery access is needed to select an image.");
            }
        };

        checkPermissions();
    }, []);

     // Retrieve user data on component load
     useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('userData');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserId(parsedUser._id); // Assuming user ID is stored in `_id`
                }
            } catch (error) {
                console.log("Error retrieving user data:", error);
            }
        };

        loadUserData();
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
                `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCtRHU9YzETXXvqI9uoBTQPQX8yJB3FuoY`,                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requests: [
                            {
                                image: { content: base64Image },
                                features: [
                                    { type: 'LABEL_DETECTION', maxResults: 10 },
                                    { type: 'OBJECT_LOCALIZATION', maxResults: 5 }, 
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
                const objects = visionData.responses[0].localizedObjectAnnotations || [];
                const detectedTexts = visionData.responses[0].textAnnotations || [];
    
                let mainObjectName = "";
                if (objects.length > 0) {
                    mainObjectName = objects[0].name.toLowerCase();
                }

                // Automatically set item type if a relevant label is detected
                let matchedtype = "Miscellaneous";
                if (labels.length > 0) {
                    for (const [type, items] of Object.entries(itemCategoryMapping)) {
                        if (labels.some(label => items.map(item => item.toLowerCase()).includes(label.description.toLowerCase()))) {
                            matchedtype = type;
                            break;
                        }
                    }
                }
                setItemType(matchedtype);
    
                const relevantLabels = labels.filter(label =>
                    mainObjectName ? label.description.toLowerCase().includes(mainObjectName) : true
                );
                const distinguishingFeaturesText = relevantLabels.slice(0, 5).map(label => label.description).join(', ');
                setDistinguishingFeatures(distinguishingFeaturesText.split(' ')[0]); // Ensure only one word for item name
    
                let longDescriptionText = "";
                if (detectedTexts.length > 0) {
                    longDescriptionText = detectedTexts[0].description.split(" ").slice(0, 15).join(" "); // Limit to 15 words
                }
    
                if (!longDescriptionText || longDescriptionText.split(" ").length < 10) {
                    longDescriptionText = labels.map(label => label.description).slice(0, 10).join(", ");
                }
    
                setLongDescription(longDescriptionText);
    
            } else {
                Alert.alert("Error", "No descriptive labels were found. Please fill manually.");
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

    const handleSubmit = async () => {
        if (!userId) {
            Alert.alert("Error", "User not logged in. Please log in again.");
            return;
        }
        
        const data = {
            userId,
            itemType,
            dateLost,
            locationKnown,
            knownLocation,
            locations: locations.filter((location) => location !== ""),
            distinguishingFeatures,
            longDescription,
            status: "found" 
        };

        // Save the date to the server
        try {
            const response = await axios.post('https://intense-earth-59719-22401d6fbb13.herokuapp.com/item/report', data);
            Alert.alert("Success", "Item reported successfully!", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                }
            ]);
        } catch (error) {
            console.error("Error reporting item:", error.response ? error.response.data : error.message);
            Alert.alert("Error", "Could not report the item. Please try again.");
        }
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

                    <QuestionLabel>Long Description (Optional)</QuestionLabel>
                    <StyledTextArea
                        placeholder="E.g., color, size, unique markings"
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