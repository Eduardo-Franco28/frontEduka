import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useState } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import mainStyles from "../styles/theme";
import useAppNavigation from "../hooks/useNavigation";
import useAuth from "../hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/colors";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

export default function AuthScreen() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const route = useRoute<RouteProp<RootStackParamList, "AuthScreen">>();
  const navigation = useAppNavigation();

  const { login, register, error, loading, user } = useAuth();

  const isLogin = route.params.isLogin;

  const handleSubmit = async () => {
    if (!validar()) return;

    let response;

    const passwordFormat = password.trim();

    if (isLogin) {
      response = await login({ email, password: passwordFormat });

      if (!response) {
        setErrorMessage("Verifique seu e-mail e senha.");
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });
    } else {
      response = await register({ name, email, password: passwordFormat });

      if (!response) {
        setErrorMessage("Não foi possível criar sua conta. Tente novamente.");
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });
    }
  };

  const validar = () => {
    if (email.trim() == "") {
      setErrorMessage("E-mail não pode ser vazio");
      return false;
    }

    if (password.trim() == "") {
      setErrorMessage("Senha não pode ser vazia");
      return false;
    }

    if (!isLogin) {
      if (password.trim() !== confirmPassword.trim()) {
        setErrorMessage("As senhas não batem");
        return false;
      }

      if (password.length < 6) {
        setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
        return false;
      }

      if (name.trim() == "") {
        setErrorMessage("Nome não pode ser vazio");
        return false;
      }
    }
    return true;
  };

  return (
    <View style={mainStyles.component}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/mascoteFeliz.png")}
            style={styles.mascote}
          />
          <Text style={styles.title}>
            {!isLogin ? "Criar conta" : "Entrar na conta"}
          </Text>
        </View>

        <ErrorMessage message={errorMessage ?? error} />

        {!isLogin && (
          <Input
            label="Seu nome"
            placeholder="Digite seu nome de usuário"
            value={name}
            onChangeText={setName}
          />
        )}

        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={hidePassword}
        />

        {!isLogin && (
          <Input
            label="Confirmar senha"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={hidePassword}
          />
        )}

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <View
            style={[styles.checkbox, !hidePassword && styles.checkBoxChecked]}
          ></View>
          <Text style={styles.checkboxLabel}>Mostrar senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          <LinearGradient
            colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
            style={mainStyles.primaryButton}
          >
            <Text style={mainStyles.primaryButtonText}>
              {isLogin ? "Entrar" : "Criar Conta"} →
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>
            {isLogin ? "Não tem conta?" : "Já tem conta?"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.replace("AuthScreen", { isLogin: !isLogin })
            }
          >
            <Text style={styles.rodapeLink}>
              {isLogin ? " Criar conta" : " Entrar na conta"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    textAlign: "left",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
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
  rodape: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  rodapeTexto: {
    fontSize: 14,
    color: "#000",
  },
  rodapeLink: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  mascote: {
    width: 70,
    height: 70,
  },
});
