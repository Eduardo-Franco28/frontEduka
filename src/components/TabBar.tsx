import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import useAppNavigation from "../hooks/useNavigation";

export default function TabBar() {
  const navigation = useAppNavigation();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("HomeScreen")}>
        <Text style={styles.tabIconActive}>🏠</Text>
        <Text style={styles.tabLabelActive}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("SubjectsScreen")}>
        <Text style={styles.tabIcon}>📋</Text>
        <Text style={styles.tabLabel}>Trajetória</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("ProfileScreen")}>
        <Text style={styles.tabIcon}>👤</Text>
        <Text style={styles.tabLabel}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e0ddd7",
    paddingVertical: 10,
    paddingBottom: 16,
    flex: 0.1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.45,
  },
  tabIconActive: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 11,
    color: "#9a9a8e",
  },
  tabLabelActive: {
    fontSize: 11,
    color: "#5b82b5",
    fontWeight: "600",
  },
});
