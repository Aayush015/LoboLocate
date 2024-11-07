import styled from "styled-components";
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const imageHeight = screenWidth * 0.5; 


// colors 
export const colors = {
    primary: "#ffffff",
    secondary: "#E5E7EB",
    tertiary: "#1F2937",
    darkLight: "#9CA3AF",
    brand: "#6D28D9",
    green: "#10B981",
    red: "#EF4444",
    unmBrand: "#ba0c2f",
};

const { primary, secondary, tertiary, darkLight, brand, green, red, unmBrand } = colors;

export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${Constants.statusBarHeight + 30}px;
    background-color: ${primary};
`;

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
    padding: 25px;
    padding-top: 80px;
    justify-content: top;
`;

export const PageLogo = styled.Image`
    width: 250px;
    height: 200px;
`;

export const Avatar = styled.Image`
    width: 100px;
    height: 100px;
    margin: auto;
    border-radius: 50px;
    border-width: 2px;
    border-color: ${secondary};
    margin-bottom: 10px;
    margin-top: 10px;
`;

export const WelcomeImage = styled.Image`
    width: ${screenWidth}px;
    height: ${imageHeight}px;
    position: relative;
    top: 0;
    left: 0;
    resize-mode: cover;
`;

export const PlusIconContainer = styled.TouchableOpacity`
    position: absolute;
    right: 25px;
    top: 25px;
    background-color: ${brand};
    width: 50px;
    height: 50px;
    border-radius: 25px;
    align-items: center;
    justify-content: center;
    z-index: 2;
`;

export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;

    ${(props) => props.welcome && `
        font-size: 35px;
    `}
`;

export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};

    ${(props) => props.welcome && `
        margin-bottom: 5px;
        font-weight: normal;
    `}
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledTextInput = styled.TextInput`
    background-color: ${secondary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 5px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
    color: ${tertiary};
    font-size: 13px;
    text-align: left;
`;

export const LeftIcon = styled.View`
    left: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
    right: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

// Menu option in Welcome.js header
// Menu options container styling (black background with rounded corners)
export const MenuOptionsContainer = {
    optionsContainer: {
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 20,
    },
};

// Menu option text styling (white text color)
export const MenuOptionText = styled.Text`
    color: white;
    font-size: 18px;
`;

// Positioned container for menu button
export const MenuPlusContainer = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    margin-top: 10px; 
    padding-right: 80px;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    margin-vertical: 5px;
    height: 60px;

    ${(props) => props.microsoft == true && `
        background-color: ${unmBrand};
        flex-direction: row;
        justify-content: center;
        border-radius: 50px;
    `}
`;

// Styled Button for Plus Icon
export const ActionButton = styled(StyledButton)`
    background-color: ${unmBrand};
    width: 100%;
    height: 50px;
    margin-vertical: 5px;
`;

export const ReportButtonsContainer = styled.View`
    width: 100%;
    align-items: center;
    margin-bottom: 10px;
`;

export const FixedBottomContainer = styled.View`
    position: absolute;
    bottom: 20px;
    width: 90%;
    align-self: center;
`;

export const ButtonText = styled.Text`
    color: ${primary};
    font-size: 16px;

    ${(props) => props.microsoft == true && `
        padding: 5px;
    `}
`;

export const MsgBox = styled.Text`
    text-align: center;
    font-size: 13px;
    color: ${props => props.type == 'SUCCESS' ? green : red};
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${darkLight};
    margin-vertical: 10px;
`;

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const ExtraText = styled.Text`
    justify-content: center;
    align-items: center;
    color: ${tertiary};
    font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;

export const TextLinkContent = styled.Text`
    color: ${brand};
    font-size: 15px;
`;

// Reporting Lost Item 
export const FormContainer = styled.View`
    flex: 1;
    width: 90%;
    padding: 10px;
    margin-top: 20px;
`;

export const QuestionLabel = styled.Text`
    font-size: 18px;
    color: ${tertiary};
    margin-bottom: 10px;
    font-weight: bold;
`;

export const MultiChoiceContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 15px;
`;

export const ChoiceButton = styled.TouchableOpacity`
    background-color: ${secondary};
    padding: 10px 15px;
    border-radius: 8px;
    margin-right: 10px;
    margin-bottom: 10px;
`;

export const ChoiceButtonText = styled.Text`
    font-size: 16px;
    color: ${tertiary};
`;

export const StyledTextArea = styled.TextInput`
    background-color: ${secondary};
    padding: 15px;
    border-radius: 5px;
    font-size: 16px;
    height: 100px;
    margin-vertical: 5px;
    color: ${tertiary};
    text-align-vertical: top;
`;