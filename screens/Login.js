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
import { View } from 'react-native';

// Colors required
const { brand, darkLight, primary } = colors;

// Keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo
            resizeMode="contain"
            source={require('../assets/img/logo.jpeg')}
          />
          <PageTitle>LoboLocate</PageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
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

                <MsgBox>.</MsgBox>
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Login</ButtonText>
                </StyledButton>
                <Line />

                <StyledButton microsoft={true} onPress={handleSubmit}>
                  <Fontisto name="microsoft" color={primary} size={24} />
                  <ButtonText microsoft={true}>Sign in with UNM Email</ButtonText>
                </StyledButton>

                <ExtraView>
                  <ExtraText>Don't have an account already? </ExtraText>
                  <TextLink>
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
