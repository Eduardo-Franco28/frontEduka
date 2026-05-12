import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirstScreen from "./src/pages/FirstScreen";
import AuthScreen from "./src/pages/AuthScreen";
import HomeScreen from "./src/pages/HomeScreen";
import SubjectsScreen from "./src/pages/SubjectsScreen";
import ProfileScreen from "./src/pages/ProfileScreen";
import SchoolYearScreen from "./src/pages/SchoolYearScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstScreen">
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SubjectsScreen" component={SubjectsScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="SchoolYearScreen" component={SchoolYearScreen} />
      </Stack.Navigator>
    </NavigationContainer>   
  );
}