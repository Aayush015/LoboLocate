import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

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
} from '../components/styles';

const Welcome = ({navigation, route}) => {
    const {name, email} = route.params;
    return (
        <>
        <StatusBar style="dark" />
        <InnerContainer>
            <WelcomeImage resizeMode="contain"source={require('../assets/img/things.jpeg')}/>
            <WelcomeContainer>
                <PageTitle welcome={true}>Welcome to LoboLocate</PageTitle>
                <SubTitle>Hi, {name || 'student'}</SubTitle>
                <SubTitle>{email || ''}</SubTitle>
                <StyledFormArea>
                    <Avatar resizeMode="contain"source={require('../assets/img/logo.jpeg')}/>
                    <Line />
                    <StyledButton onPress={() => {navigation.navigate("Login")}}>
                        <ButtonText>Logout</ButtonText>
                    </StyledButton>
                </StyledFormArea>
            </WelcomeContainer>
        </InnerContainer>
        </>
    );
};

export default Welcome;
