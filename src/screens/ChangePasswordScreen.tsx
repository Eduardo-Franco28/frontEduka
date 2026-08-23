import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import mainStyles from "../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import { useState } from "react";
import Header from "../components/Header";

export default function ChangePasswordScreen(){
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    return(
        <SafeAreaView style={mainStyles.component} edges={["top"]}>
            <ScrollView
                style={mainStyles.scroll}
                contentContainerStyle={mainStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                
                <Header title="Alterar senha"/>

                <Input 
                    label="Senha atual"
                    placeholder="Digite sua senha atual"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Input 
                    label="Nova senha"
                    placeholder="Digite sua nova senha"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Input 
                    label="Senha atual"
                    placeholder="Digite sua senha atual"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
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