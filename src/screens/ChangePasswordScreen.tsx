import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import mainStyles from "../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import { useState } from "react";
import Header from "../components/Header";
import ErrorMessage from "../components/ErrorMessage";
import useAppNavigation from "../hooks/useNavigation";
import useAuth from "../hooks/useAuth";
import { COLORS } from "../styles/colors";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const navigation = useAppNavigation();

  const { updatePassword, error, user } = useAuth();

  const handleSubmit = async () => {
    if (!validar()) return;

    let response;

    const currentPasswordFormat = currentPassword.trim();
    const newPasswordFormat = newPassword.trim();

    response = await updatePassword({
      currentPassword: currentPasswordFormat,
      newPassword: newPasswordFormat,
    });

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
      setErrorMessage("Senha atual não pode ser vazia");
      return false;
    }

    if (newPassword.trim() == "") {
      setErrorMessage("Nova senha não pode ser vazia");
      return false;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setErrorMessage("As senhas não batem");
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
        <Header title="Alterar senha" />

        <ErrorMessage message={errorMessage ?? error} />

        <Input
          label="Senha atual"
          placeholder="Digite sua senha atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={hidePassword}
        />

        <Input
          label="Nova senha"
          placeholder="Digite sua nova senha"
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={hidePassword}
        />

        <Input
          label="Confirmar senha"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={hidePassword}
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

        <TouchableOpacity
          style={mainStyles.primaryButton}
          onPress={handleSubmit}
        >
          <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
})
