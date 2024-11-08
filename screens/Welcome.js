import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
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
    const [userId, setUserId] = useState(null); // State to store userId

    const toggleReportButtons = () => {
        setShowReportButtons(!showReportButtons);
    };

    // Fetch userId from AsyncStorage on component mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('userData');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserId(parsedUser._id); // Assuming user ID is stored in `_id`
                }
            } catch (error) {
                console.log("Error retrieving user ID:", error);
            }
        };
        fetchUserId();
    }, []);

    // Set header tint color to black
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

                {/* Positioned Container for Menu Button */}
                <MenuPlusContainer>
                    <Menu>
                        <MenuTrigger>
                            <FontAwesome name="bars" size={40} color={brand} />
                        </MenuTrigger>
                        <MenuOptions customStyles={MenuOptionsContainer}>
                            <MenuOption onSelect={() => navigation.navigate("PotentialMatches", { userId })}>
                                <MenuOptionText>Potential Matches</MenuOptionText>
                            </MenuOption>
                            <MenuOption onSelect={() => navigation.navigate("UserHistory")}>
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
            </InnerContainer>
        </>
    );
};

export default Welcome;
