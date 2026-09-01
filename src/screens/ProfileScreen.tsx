import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import mainStyles from "../styles/theme";
import TabBar from "../components/TabBar";
import useAuth from "../hooks/useAuth";
import useAppNavigation from "../hooks/useNavigation";
import useTheme from "../hooks/useTheme";
import Header from "../components/Header";

export default function ProfileScreen() {
  const { logOut, user } = useAuth();
  const { colors, fontScale, isDark } = useTheme();

  const navigation = useAppNavigation();

  const handleLogOut = async () => {
    await logOut();

    navigation.reset({
      index: 0,
      routes: [{ name: "WelcomeScreen" }],
    });
  };

  return (
    <View style={[mainStyles.component, { backgroundColor: colors.BG_APP }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_WARM}
      />

      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Meu perfil" showBack={false} />

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.CARD }]}>
          <View style={[styles.avatarCircle, { borderColor: colors.PRIMARY }]}>
            <Image
              style={styles.avatarEmoji}
              source={require("../../assets/mascotePerfil.png")}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.profileName,
                { color: colors.TEXT_PRIMARY, fontSize: 20 * fontScale },
              ]}
            >
              {user?.nome}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.CARD }]}>
            <Text style={[styles.statValue, { color: colors.PRIMARY_LIGHT, fontSize: 22 * fontScale }]}>
              24
            </Text>
            <Text style={[styles.statLabel, { color: colors.TEXT_MUTED, fontSize: 11 * fontScale }]}>
              ESTRELAS
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.CARD }]}>
            <Text style={[styles.statValue, { color: colors.TEXT_PRIMARY, fontSize: 22 * fontScale }]}>
              12
            </Text>
            <Text style={[styles.statLabel, { color: colors.TEXT_MUTED, fontSize: 11 * fontScale }]}>
              ATIVIDADES
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.CARD }]}>
            <Text style={[styles.statValue, { color: colors.WARNING, fontSize: 22 * fontScale }]}>
              3🔥
            </Text>
            <Text style={[styles.statLabel, { color: colors.TEXT_MUTED, fontSize: 11 * fontScale }]}>
              DIAS
            </Text>
          </View>
        </View>

        {/* Menu Card */}
        <View style={[styles.menuCard, { backgroundColor: colors.CARD }]}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>🏆</Text>
            <Text style={[styles.menuLabel, { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale }]}>
              Conquistas
            </Text>
            <Text style={[styles.menuChevron, { color: colors.TEXT_MUTED }]}>→</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.BORDER_LIGHT }]} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("AccessibilityScreen")}
          >
            <Text style={styles.menuIcon}>♿</Text>
            <Text style={[styles.menuLabel, { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale }]}>
              Acessibilidade
            </Text>
            <Text style={[styles.menuChevron, { color: colors.TEXT_MUTED }]}>→</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.BORDER_LIGHT }]} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={[styles.menuLabel, { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale }]}>
              Editar perfil
            </Text>
            <Text style={[styles.menuChevron, { color: colors.TEXT_MUTED }]}>→</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.BORDER_LIGHT }]} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("ChangePasswordScreen")}
          >
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={[styles.menuLabel, { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale }]}>
              Alterar senha
            </Text>
            <Text style={[styles.menuChevron, { color: colors.TEXT_MUTED }]}>→</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.BORDER_LIGHT }]} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleLogOut}
          >
            <Text style={styles.menuIcon}>📕</Text>
            <Text style={[styles.menuLabel, { color: colors.DANGER, fontSize: 15 * fontScale }]}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 52,
  },

  // Profile card
  profileCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  avatarEmoji: {
    width: 48,
    height: 48,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: "700",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontWeight: "800",
  },
  statLabel: {
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  // Menu
  menuCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    flex: 1,
    fontWeight: "600",
  },
  menuChevron: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginLeft: 34,
  },
});