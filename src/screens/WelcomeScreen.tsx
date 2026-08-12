import { LinearGradient } from "expo-linear-gradient";
import useAppNavigation from "../hooks/useNavigation";
import { View, Text, TouchableOpacity, Image, StyleSheet} from "react-native";
import { COLORS } from "../styles/colors";
import useAuth from "../hooks/useAuth";

export default function WelcomeScreen() {
    const navigation = useAppNavigation();
    const {user} = useAuth();

    const handleGetStarted = () => {
        if(user){
            navigation.replace("HomeScreen")
        } else{
            navigation.replace("FirstScreen")
        }
    }

    return(
        <LinearGradient colors={[COLORS.PRIMARY, COLORS.SECONDARY]} style={styles.gradient}>
            <TouchableOpacity onPress={handleGetStarted} style={{alignItems: 'center'}}>
            <Image source={require('../../assets/mascote.png')} />
                <Text style={styles.title}>IntegraMente</Text>
                <Text style={styles.subtitle}>Aprender do seu jeito</Text>
            <View style={styles.rowBalls}>
                <View style={styles.stretchedBall}></View>
                <View style={styles.ball}></View>
                <View style={styles.ball}></View>
            </View>
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    title:  {
        fontSize: 46,
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle:  {
        fontSize: 16,
        color: '#ffffffb0',
        fontWeight: '400',
        textAlign: 'center',
    },
    rowBalls: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 32,
    },
    ball: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: '#ffffffb0',
    },
    stretchedBall: {
        width: 26,
        height: 10,
        borderRadius: 16,
        backgroundColor: '#fff',
    },
})
