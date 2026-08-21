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
import { AuthProvider } from "./src/contexts/AuthContext";
import useAuth from "./src/hooks/useAuth";

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
      <Stack.Screen name="FirstScreen" component={FirstScreen} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
