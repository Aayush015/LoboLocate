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
import { View, TouchableOpacity, ActivityIndicator} from 'react-native';

// Colors required
const { brand, darkLight, primary } = colors;

// Datetimepicker for calendar
import DateTimePicker from '@react-native-community/datetimepicker';

// Api Client 
import axios from 'axios';

const Signup = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  // Actual date of birth user selects
  const [dateOfBirth, setDateOfBirth] = useState();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDateOfBirth(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  // Form Handling
  const handleSignup = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = 'https://intense-earth-59719-22401d6fbb13.herokuapp.com/user/signup';

    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data; 
        const {message, status, data} = result; 

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          navigation.navigate('Welcome', {...data});
        }
        setSubmitting(false);
      })
      .catch(error => {
        console.log(error.JSON());
        setSubmitting(false);
        handleMessage("An error occurred. Please check your internet connection and try again");
    })
  }

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  }

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageTitle>LoboLocate</PageTitle>
        <SubTitle>Account Signup</SubTitle>
        
        {show && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode='date'
                is24Hour={true}
                display="default"
                onChange={onChange}
            />
        )}

        <Formik
          initialValues={{ name: '', email: '', dateOfBirth: '', password: '', confirmPassword: '' }}
          onSubmit={(values, {setSubmitting}) => {
            values = { ...values, dateOfBirth: dateOfBirth};
            console.log('Submitting values:', values);
            if (
              values.email == '' || 
              values.password == '' || 
              values.name == '' || 
              values.dateOfBirth == '' || 
              values.confirmPassword == ''
            ) {
              handleMessage("Please fill all the fields");
              setSubmitting(false);
            } else if (values.password !== values.confirmPassword) {
              handleMessage("Passwords do not match");
              setSubmitting(false);
            } else {
              handleSignup(values, setSubmitting);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
            <StyledFormArea>
              <MyTextInput
                label="Full Name"
                icon="person"
                placeholder="Salman Khan"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />

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
              label="Date of Birth"
              icon="calendar"
              placeholder="YYYY - MM - DD"
              placeholderTextColor={darkLight}
              onChangeText={handleChange('dateOfBirth')}
              onBlur={handleBlur('dateOfBirth')}
              value={dateOfBirth ? dateOfBirth.toDateString() : ''}
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
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
            <MyTextInput
                label="Confirm Password"
                icon="lock"
                placeholder="* * * * * * * * *"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />
              <MsgBox type={messageType}>{message}</MsgBox>

              {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Signup</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}

              <Line />
              <ExtraView>
                <ExtraText> Already have an account? </ExtraText>
                <TextLink onPress={() => navigation.navigate("Login")}>
                  <TextLinkContent>Login</TextLinkContent>
                </TextLink>
              </ExtraView>
            </StyledFormArea>
          )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, showDatePicker, isDate, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {!isDate && <StyledTextInput {...props} />}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Signup;