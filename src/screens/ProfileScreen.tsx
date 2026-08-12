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
import { COLORS } from "../styles/colors";
import useAuth from "../hooks/useAuth";
import useAppNavigation from "../hooks/useNavigation";

export default function ProfileScreen() {
  const { logOut } = useAuth();

  const navigation = useAppNavigation();

  const handleLogOut = async () => {
    await logOut();

    navigation.reset({
      index: 0,
      routes: [{ name: "WelcomeScreen" }],
    });
  };

  return (
    <View style={mainStyles.component}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG_WARM} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Meu Perfil</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Image
              style={styles.avatarEmoji}
              source={require("../../assets/mascotePerfil.png")}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Eduardo</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.PRIMARY_LIGHT }]}>
              24
            </Text>
            <Text style={styles.statLabel}>ESTRELAS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.TEXT_PRIMARY }]}>
              12
            </Text>
            <Text style={styles.statLabel}>ATIVIDADES</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.WARNING }]}>
              3🔥
            </Text>
            <Text style={styles.statLabel}>DIAS</Text>
          </View>
        </View>

        {/* Menu Card */}
        <View style={styles.menuCard}>
          {/* Conquistas */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>🏆</Text>
            <Text style={styles.menuLabel}>Conquistas</Text>
            <Text style={styles.menuChevron}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Acessibilidade */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>♿</Text>
            <Text style={styles.menuLabel}>Acessibilidade</Text>
            <Text style={styles.menuChevron}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Editar dados */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={styles.menuLabel}>Editar dados</Text>
            <Text style={styles.menuChevron}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Sair */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleLogOut}
          >
            <Text style={styles.menuIcon}>📕</Text>
            <Text style={[styles.menuLabel, styles.menuLabelDanger]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 24,
  },

  // Page title
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },

  // Profile card
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.SURFACE_BLUE,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarEmoji: {
    width: 28,
    height: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 3,
  },
  profileSub: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 6,
  },
  stars: {
    fontSize: 16,
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.TEXT_MUTED,
    letterSpacing: 0.8,
  },

  // Menu card
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_PRIMARY,
  },
  menuLabelDanger: {
    color: COLORS.DANGER,
  },
  menuChevron: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BG_WARM,
    marginLeft: 52,
  },
});
