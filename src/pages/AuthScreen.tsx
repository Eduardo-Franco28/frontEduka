import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import mainStyles from "../styles/theme";
import useAppNavigation from "../hooks/useNavigation";
import useAuth from "../hooks/useAuth";

export default function AuthScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const {login, register, userLogin, userRegister, error, loading} = useAuth();

  const route = useRoute<RouteProp<RootStackParamList, "AuthScreen">>();
  const navigation = useAppNavigation();

  const isLogin = route.params.isLogin;

  const handleSubmit = async () => {
    if (error != null) {
      Alert.alert("Ops", error)
      return;
    }
    if (!validar()) return;

    if(isLogin){
      await login({
        email,
        password
      })
    } else {
      await register({
        name,
        email,
        password
      })
    }

    navigation.navigate("HomeScreen")
  }

  const validar = () => {
    if (name.trim() == "") {
      Alert.alert("Nome não pode ser vazio")
      return false
    } 

    if (email.trim() == "") {
      Alert.alert("E-mail não pode ser vazio")
      return false
    } 

    if(!isLogin) {
      if (password.trim() == "") {
        Alert.alert("Senha não pode ser vazia")
        return false
      }

      if (password.length <= 3) {
        Alert.alert("Senha Fraca")
        return false
      }

      if (password.trim() !== confirmPassword.trim()) {
        Alert.alert("As senhas não batem")
        return false
      }
    }
    return true
  }

  return (
    <View style={mainStyles.component}>
      <View style={styles.container}>
        <Text style={mainStyles.headerTitle}>Entrar na conta</Text>

        <View style={styles.dica}>
          <Text style={styles.dicaTexto}>
            {isLogin ? "🦁 Olá! Digite seu e-mail e senha para entrar." 
            : "🦁Vamos criar sua conta juntos! Preencha cada campo com calma, sem pressa."}
          </Text>
        </View>

        {!isLogin && (
          <>
            <Text style={styles.label}>Seu nome</Text>
            <TextInput 
            style={styles.input} 
            placeholder="Digite seu nome de usuário"
            onChangeText={setName}
            />
          </>
        )}

        <Text style={styles.label}>E-mail</Text>
        <TextInput 
        style={styles.input}
        placeholder="Digite seu e-mail"
        onChangeText={setEmail}
        />
        <Text style={styles.inputHint}>Use o e-mail que você cadastrou</Text>

        <Text style={styles.label}>Senha</Text>
        <TextInput 
        style={styles.input}
        placeholder="Digite sua senha"
        onChangeText={setPassword}
        />

        {!isLogin && (
          <>
            <Text style={styles.label}>Confimar senha</Text>
            <TextInput 
            style={styles.input} 
            placeholder="Confirme sua senha"
            onChangeText={setConfirmPassword}
            />
          </>
        )}

        <View style={styles.checkboxRow}>
          <View style={styles.checkbox} />
          <Text style={styles.checkboxLabel}>Mostrar senha</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
        >
          <Text style={styles.primaryButtonText}>
            {isLogin ? "Entrar" : "Criar Conta"} →
          </Text>
        </TouchableOpacity>

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>
            {isLogin ? "Não tem conta?" : "Já tem conta?"}
          </Text>
          <TouchableOpacity>
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
  },
  dica: {
    backgroundColor: "#dce8f5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
  },
  dicaTexto: {
    fontSize: 14,
    color: "#3a5a7a",
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3a4a",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#4a6fa5",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  inputHint: {
    fontSize: 12,
    color: "#8a9ab0",
    marginBottom: 20,
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
    borderColor: "#4a6fa5",
    backgroundColor: "#fff",
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#2d3a4a",
  },
  primaryButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#4a6fa5",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "center",
  },
  rodapeTexto: {
    fontSize: 14,
    color: "#7a8ba8",
  },
  rodapeLink: {
    fontSize: 14,
    color: "#4a6fa5",
    fontWeight: "600",
  },
});
