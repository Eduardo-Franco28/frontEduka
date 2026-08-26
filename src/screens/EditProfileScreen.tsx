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
import useAppNavigation from "../hooks/useNavigation";
import useAuth from "../hooks/useAuth";
import ErrorMessage from "../components/ErrorMessage";

export default function EditProfileScreen() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const navigation = useAppNavigation();

  const { updateProfile, error, user } = useAuth();

   const handleSubmit = async () => {
    if (!validar()) return;

    let response;

      response = await updateProfile({ name: name.trim(), email: email.trim(), currentPassword: currentPassword.trim() });

      if (!response) {
        setErrorMessage("Verique se os campos foram preenchidos corretamente.");
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ name: "ProfileScreen" }],
      });
  };

  const validar = () => {
    if (currentPassword.trim() == "") {
      setErrorMessage("Senha não pode ser vazia");
      return false;
    }

    if (email.trim() == "") {
      setErrorMessage("E-mail não pode ser vazio");
      return false;
    }
    
    if (name.trim() == "") {
      setErrorMessage("Nome não pode ser vazio");
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={mainStyles.component} edges={["top"]}>
      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={mainStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Header title="Editar Perfil"/>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Image
              style={styles.avatarEmoji}
              source={require("../../assets/mascotePerfil.png")}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.nome}</Text>
          </View>
        </View>

        <ErrorMessage message={errorMessage ?? error} />

        <Input 
            label="Username"
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            autoCorrect={false}
        />

        <Input 
            label="E-mail"
            placeholder="Digite seu novo email"
            value={email}
            onChangeText={setEmail}
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

        <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setHidePassword(!hidePassword)}
        >
          <View
            style={[styles.checkbox, !hidePassword && styles.checkBoxChecked]}
          ></View>
          <Text style={styles.checkboxLabel}>Mostrar senhas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={mainStyles.primaryButton} onPress={handleSubmit}>
            <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  checkBoxChecked: {
    backgroundColor: COLORS.PRIMARY,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
  },
});
