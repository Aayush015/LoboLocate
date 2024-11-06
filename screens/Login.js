import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

// Formik
import { Formik } from 'formik';

// Icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

// Colors
import { colors, RightIcon } from '../components/styles';

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText, 
  MsgBox, 
  Line,
  ExtraView, 
  ExtraText,
  TextLink,
  TextLinkContent,
} from '../components/styles';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Colors required
const { brand, darkLight, primary } = colors;

// Keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// Axios API client
import axios from 'axios';

const Login = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = 'https://intense-earth-59719-22401d6fbb13.herokuapp.com/user/signin';

    axios
    .post(url, credentials)
    .then(async (response) => {
      const result = response.data;
      const { message, status, data } = result;

      if (status !== 'SUCCESS') {
        handleMessage(message, status);
      } else {
        try {
          // Store user data in AsyncStorage
          await AsyncStorage.setItem('userData', JSON.stringify(data[0]));
          navigation.navigate('Welcome', { ...data[0] });
        } catch (error) {
          console.log("Error storing user data:", error);
        }
      }
      setSubmitting(false);
    })
    .catch((error) => {
      console.log(error);
      setSubmitting(false);
      handleMessage("An error occurred. Please check your internet connection and try again");
    });
  };

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  }

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo
            resizeMode="contain"
            source={require('../assets/img/lobo_locate.png')}
          />
          <PageTitle>LoboLocate</PageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values, {setSubmitting}) => {
              if (values.email == '' || values.password == '') {
                handleMessage("Please fill in all fields");
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="asdf123@gmail.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />

                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />

                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}

                <Line />
                <StyledButton microsoft={true} onPress={handleSubmit}>
                  <Fontisto name="microsoft" color={primary} size={24} />
                  <ButtonText microsoft={true}>Sign in with UNM Email</ButtonText>
                </StyledButton>

                <ExtraView>
                  <ExtraText>Don't have an account already? </ExtraText>
                  <TextLink onPress={() => navigation.navigate("Signup")}>
                    <TextLinkContent>Sign Up</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
