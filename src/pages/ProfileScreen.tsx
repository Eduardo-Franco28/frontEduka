import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import mainStyles from "../styles/theme";
import TabBar from "../components/TabBar";

export default function ProfileScreen() {
  return (
    <View style={mainStyles.component}>
      <StatusBar barStyle="light-content" backgroundColor="#5b82b5" />

      {/* Hero Header */}
      <View style={styles.hero}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🦁</Text>
        </View>
        <Text style={styles.heroName}>Larry Wheels</Text>
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>3° Ano do Ensino Médio</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Dias seguidos</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMiddle]}>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>Acertos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>142 XP</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Minha conta</Text>

        {/* Menu Items */}
        <View style={styles.menuCard}>

          {/* Minhas conquistas */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconBox}>
              <Text style={styles.menuIcon}>🏆</Text>
            </View>
            <Text style={styles.menuLabel}>Minhas conquistas</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Acessibilidade */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconBox}>
              <Text style={styles.menuIcon}>⚙️</Text>
            </View>
            <Text style={styles.menuLabel}>Acessibilidade</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Editar nome */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconBox}>
              <Text style={styles.menuIcon}>✏️</Text>
            </View>
            <Text style={styles.menuLabel}>Editar nome</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Redefinir E-mail */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconBox}>
              <Text style={styles.menuIcon}>✉️</Text>
            </View>
            <Text style={styles.menuLabel}>Redefinir E-mail</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Redefinir Senha */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconBox}>
              <Text style={styles.menuIcon}>🔒</Text>
            </View>
            <Text style={styles.menuLabel}>Redefinir Senha</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  // Hero
  hero: {
    backgroundColor: "#5b82b5",
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 44,
  },
  heroName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  badgePill: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  statCardMiddle: {
    backgroundColor: "#5b82b5",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3340",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#9a9a8e",
    textAlign: "center",
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3340",
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  // Menu card
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f5f3ef",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    fontSize: 19,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#2d3340",
  },
  menuChevron: {
    fontSize: 20,
    color: "#c0bdb6",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0ede8",
    marginLeft: 70,
  },
});