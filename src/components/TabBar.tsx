import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationState } from "@react-navigation/native";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import useAppNavigation from "../hooks/useNavigation";
import { COLORS } from "../styles/colors";

const TABS = [
  { route: "HomeScreen", label: "Início", icon: "house" },
  { route: "SubjectsScreen", label: "Trajetória", icon: "map" },
  { route: "ProfileScreen", label: "Perfil", icon: "user" },
] as const;

export default function TabBar() {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();

  const currentRoute = useNavigationState(
    (state) => state?.routes[state.index]?.name
  );

  return (
    <View
      style={[
        styles.tabBar,
        {
          height: 68 + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = currentRoute === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tabItem}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => navigation.navigate(tab.route)}
          >
            <FontAwesomeFreeSolid
              name={tab.icon}
              size={24}
              color={isActive ? COLORS.PRIMARY : COLORS.TEXT_MUTED}
            />
            <Text style={isActive ? styles.tabLabelActive : styles.tabLabel}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    fontWeight: "500",
  },
  tabLabelActive: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: "700",
  },
});