import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {FontAwesome} from '@expo/vector-icons';

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
} from '../components/styles';

// Report Lost Item Screen
import ReportLostItem from './ReportLostItem';

const Welcome = ({navigation, route}) => {
    const {name, email} = route.params;
    const [showReportButtons, setShowReportButtons] = useState(false);

    const toggleReportButtons = () => {
        setShowReportButtons(!showReportButtons);
    };

    return (
        <>
        <StatusBar style="dark" />
        <InnerContainer>
                <WelcomeImage resizeMode="contain" source={require('../assets/img/things.jpeg')} />
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
