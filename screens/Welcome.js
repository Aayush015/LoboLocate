import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StatusBar, Modal, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avatar,
    PlusIconContainer,
    ActionButton,
    ReportButtonsContainer,
    FixedBottomContainer,
    MenuPlusContainer,
    MenuOptionsContainer,
    MenuOptionText,
} from '../components/styles';

import { colors } from '../components/styles';
const { brand } = colors;

const Welcome = ({ navigation, route }) => {
    const { name, email } = route.params;
    const [showReportButtons, setShowReportButtons] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const toggleReportButtons = () => {
        setShowReportButtons(!showReportButtons);
    };

    useEffect(() => {
        const checkTermsViewed = async () => {
            try {
                const hasViewedTerms = await AsyncStorage.getItem('hasViewedTerms');
                if (!hasViewedTerms) {
                    setShowTermsModal(true);
                }
            } catch (error) {
                console.log("Error checking Terms and Conditions:", error);
            }
        };

        const fetchUserId = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('userData');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserId(parsedUser._id);
                }
            } catch (error) {
                console.log("Error retrieving user ID:", error);
            }
        };

        checkTermsViewed();
        fetchUserId();
    }, []);

    const handleTermsAccept = async () => {
        try {
            await AsyncStorage.setItem('hasViewedTerms', 'true');
            setShowTermsModal(false);
        } catch (error) {
            console.log("Error saving Terms and Conditions acceptance:", error);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTintColor: '#000',
        });
    }, [navigation]);

    return (
        <>
            <StatusBar style="dark" />
            <InnerContainer>
                <WelcomeImage resizeMode="contain" source={require('../assets/img/things.jpeg')} />

                <MenuPlusContainer>
                    <Menu>
                        <MenuTrigger>
                            <FontAwesome name="bars" size={40} color={brand} />
                        </MenuTrigger>
                        <MenuOptions customStyles={MenuOptionsContainer}>
                            <MenuOption onSelect={() => navigation.navigate("PotentialMatches", { userId })}>
                                <MenuOptionText>Potential Matches</MenuOptionText>
                            </MenuOption>
                            <MenuOption onSelect={() => navigation.navigate("UserHistory", { userId })}>
                                <MenuOptionText>History</MenuOptionText>
                            </MenuOption>
                            <MenuOption onSelect={() => navigation.navigate("UnclaimedItems")}>
                                <MenuOptionText>Unclaimed Items</MenuOptionText>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </MenuPlusContainer>

                <WelcomeContainer>
                    <PageTitle welcome={true}>Welcome to LoboLocate</PageTitle>
                    <SubTitle>Hi, {name || 'student'}</SubTitle>
                    <SubTitle>{email || ''}</SubTitle>
                    <StyledFormArea>
                        <Avatar resizeMode="contain" source={require('../assets/img/lobo_locate.png')} />

                        <PlusIconContainer onPress={toggleReportButtons}>
                            <FontAwesome name="plus" size={24} color="#fff" />
                        </PlusIconContainer>

                        {showReportButtons && (
                            <ReportButtonsContainer>
                                <ActionButton onPress={() => navigation.navigate("ReportLostItem")}>
                                    <ButtonText>Report Lost Item</ButtonText>
                                </ActionButton>
                                <ActionButton onPress={() => navigation.navigate("ReportFoundItem")}>
                                    <ButtonText>Report Found Item</ButtonText>
                                </ActionButton>
                            </ReportButtonsContainer>
                        )}
                    </StyledFormArea>
                </WelcomeContainer>

                <FixedBottomContainer>
                    <Line />
                    <StyledButton onPress={() => { navigation.navigate("Login") }}>
                        <ButtonText>Logout</ButtonText>
                    </StyledButton>
                </FixedBottomContainer>

                {/* Terms and Conditions Modal */}
                <Modal
                    visible={showTermsModal}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Terms and Conditions</Text>
                            <Text style={{ marginBottom: 20 }}>Welcome to LoboLocate, UNM’s Lost and Found app. By using this app, you agree to:
                                                                Accurate Reporting: Provide truthful descriptions for lost or found items.
                                                                Privacy Respect: Respect the privacy of others and use this app responsibly.
                                                                Data Use: We collect and use your data to facilitate item matching and user support. Your data is protected and will not be shared outside UNM.
                                                                For detailed terms, please visit our settings or contact UNM Lost and Found Department (Hokona Hall, 2500 Campus Blvd NE), (505)277-0081.
                            </Text>
                            <TouchableOpacity onPress={handleTermsAccept} style={{ backgroundColor: brand, padding: 10, borderRadius: 5 }}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </InnerContainer>
        </>
    );
};

export default Welcome;