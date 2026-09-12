import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FirstScreen from "./src/screens/FirstScreen";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SubjectsScreen from "./src/screens/SubjectsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import TopicsScreen from "./src/screens/TopicsScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import ActivityScreen from "./src/activities/ActivityScreen";
import ActivityScreen2 from "./src/activities/ActivityScreen2";
import ActivityScreen3 from "./src/activities/ActivityScreen3";
import ActivityScreen4 from "./src/activities/ActivityScreen4";
import ActivityScreen5 from "./src/activities/ActivityScreen5";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import useAuth from "./src/hooks/useAuth";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import AccessibilityScreen from "./src/screens/AccessibilityScreen";
import ResultScreen from "./src/screens/ResultScreen";

const Stack = createNativeStackNavigator();

function Routes() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SubjectsScreen" component={SubjectsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="TopicsScreen" component={TopicsScreen} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      <Stack.Screen name="ActivityScreen2" component={ActivityScreen2} />
      <Stack.Screen name="ActivityScreen3" component={ActivityScreen3} />
      <Stack.Screen name="ActivityScreen4" component={ActivityScreen4} />
      <Stack.Screen name="ActivityScreen5" component={ActivityScreen5} />
      <Stack.Screen name="FirstScreen" component={FirstScreen} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="AccessibilityScreen" component={AccessibilityScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}