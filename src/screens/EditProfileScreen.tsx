import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import Header from "../components/Header";
import Input from "../components/Input";
import { useState } from "react";

export default function EditProfileScreen() {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [currentPassword, setCurrentPassword] = useState<string>("") //todo email
  const [currentPassword, setCurrentPassword] = useState<string>("") //todo username

  return (
    <SafeAreaView style={mainStyles.component} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        <Header title="Editar Perfil"/>

        <Input 
            label="E-mail"
            placeholder="Digite seu novo email"
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
        />

        <Input 
            label="Username"
            placeholder="Digite seu nome"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
        />

        <Input 
            label="Senha atual"
            placeholder="Digite sua senha atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            autoCapitalize="none"
            autoCorrect={false}
        />

        <TouchableOpacity style={mainStyles.primaryButton}>
            <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // Profile card
  profileCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "column",
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
});
