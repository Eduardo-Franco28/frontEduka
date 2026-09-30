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
import Header from "../components/Header";
import Input from "../components/Input";
import { useState } from "react";
import useAppNavigation from "../hooks/useNavigation";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import ErrorMessage from "../components/ErrorMessage";

export default function EditProfileScreen() {
  const { updateProfile, error, loading, user } = useAuth();

  // Os campos já vêm com os dados atuais: a pessoa só mexe no que quer mudar.
  const [nome, setNome] = useState<string>(user?.nome ?? "")
  const [email, setEmail] = useState<string>(user?.email ?? "")
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const navigation = useAppNavigation();
  const { colors, fontScale } = useTheme();

  // Sem mudança nenhuma, não há o que salvar: o botão fica travado.
  const nothingChanged =
    nome.trim() === user?.nome && email.trim() === user?.email;

   const handleSubmit = async () => {
    setErrorMessage("");

    if (!validar()) return;

    let response;

      response = await updateProfile({ nome: nome.trim(), email: email.trim(), currentPassword: currentPassword.trim() });

      if (!response) return;

      // O contexto já atualizou o usuário e guardou o token novo. É só voltar:
      // o Perfil está logo atrás e mostra o nome novo sozinho.
      navigation.goBack();
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
    
    if (nome.trim() == "") {
      setErrorMessage("Nome não pode ser vazio");
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView
      style={[mainStyles.component, { backgroundColor: colors.BG_APP }]}
      edges={["top"]}
    >
      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={mainStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Header title="Editar Perfil"/>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor: colors.SURFACE_BLUE,
                borderColor: colors.PRIMARY_LIGHT,
              },
            ]}
          >
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

        <ErrorMessage message={errorMessage || error} />

        <Input 
            label="Nome"
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
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
            secureTextEntry={hidePassword}
        />

        <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setHidePassword(!hidePassword)}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.BORDER_LIGHT, backgroundColor: colors.CARD },
              !hidePassword && { backgroundColor: colors.PRIMARY },
            ]}
          ></View>
          <Text
            style={[
              styles.checkboxLabel,
              { color: colors.TEXT_DARK, fontSize: 14 * fontScale },
            ]}
          >
            Mostrar senhas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[mainStyles.primaryButton, (nothingChanged || loading) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={nothingChanged || loading}
        >
            <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.5,
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
    borderWidth: 2,
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
    fontWeight: "700",
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
    marginRight: 10,
  },
  checkboxLabel: {
    fontWeight: "500",
  },
});