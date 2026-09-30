import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/colors";

// Quanto a abertura fica na tela antes de ir pra Home (ou pro login).
export const SPLASH_DURATION_MS = 5500;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Proporcao do proprio GIF (397x346). Se a caixa nao tiver essa proporcao, o
// `contain` sobra espaco em cima e embaixo e o pinguim encolhe no meio dela.
const MASCOT_RATIO = 397 / 346;
const MASCOT_WIDTH = Math.round(Math.min(380, SCREEN_WIDTH * 0.92));
const MASCOT_HEIGHT = Math.round(MASCOT_WIDTH / MASCOT_RATIO);
const HALO_SIZE = Math.round(MASCOT_HEIGHT * 0.78);

const RAY_COUNT = 12;
const RAY_LENGTH = Math.round(MASCOT_WIDTH * 1.05);

const BUBBLES = [
  { size: 70, left: "8%", delay: 0, duration: 7000 },
  { size: 42, left: "26%", delay: 1800, duration: 8500 },
  { size: 96, left: "58%", delay: 700, duration: 9000 },
  { size: 54, left: "80%", delay: 2600, duration: 7600 },
  { size: 34, left: "44%", delay: 3800, duration: 8000 },
];

// Brilhos espalhados pelo fundo. Sao losangos simples de propósito: icone de
// fonte pode nao ter carregado ainda nessa tela, que e a primeira do app.
const TWINKLES = [
  { top: "14%", left: "12%", size: 14, delay: 200, duration: 2600 },
  { top: "22%", left: "82%", size: 10, delay: 900, duration: 3000 },
  { top: "68%", left: "18%", size: 12, delay: 1500, duration: 2800 },
  { top: "74%", left: "76%", size: 16, delay: 400, duration: 3200 },
  { top: "40%", left: "6%", size: 9, delay: 2100, duration: 2400 },
  { top: "52%", left: "92%", size: 11, delay: 1200, duration: 2900 },
  { top: "9%", left: "50%", size: 12, delay: 2600, duration: 3100 },
];

interface SplashLoadingProps {
  onSkip?: () => void;
}

interface BubbleProps {
  size: number;
  left: string;
  delay: number;
  duration: number;
}

function Bubble({ size, left, delay, duration }: BubbleProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [progress, duration, delay]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.35, -SCREEN_HEIGHT * 0.75],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 0.8, 1],
    outputRange: [0, 0.18, 0.12, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: left as never,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

function Halo({ toScale, delay }: { toScale: number; delay: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2600,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [progress, delay]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, toScale],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.halo, { opacity, transform: [{ scale }] }]}
    />
  );
}

/** Raios girando bem devagar atras do mascote. */
function Sunburst() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 26000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.sunburst, { transform: [{ rotate }] }]}
    >
      {Array.from({ length: RAY_COUNT }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.ray,
            { transform: [{ rotate: `${(180 / RAY_COUNT) * index}deg` }] },
          ]}
        />
      ))}
    </Animated.View>
  );
}

interface TwinkleProps {
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
}

function Twinkle({ top, left, size, delay, duration }: TwinkleProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [progress, duration, delay]);

  const scale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 1, 0.2],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.85, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: top as never,
        left: left as never,
        opacity,
        transform: [{ scale }],
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          backgroundColor: "#ffffff",
          transform: [{ rotate: "45deg" }],
        }}
      />
    </Animated.View>
  );
}

export default function SplashLoading({ onSkip }: SplashLoadingProps) {
  const mascotScale = useRef(new Animated.Value(0.5)).current;
  const mascotBreath = useRef(new Animated.Value(1)).current;
  const mascotOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const barProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entrance = Animated.stagger(260, [
      Animated.parallel([
        Animated.timing(mascotOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(mascotScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    // Respiracao lenta somada a escala de entrada: os dois `scale` se
    // multiplicam, entao isso nao briga com a animacao que ja vem no GIF.
    const breath = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotBreath, {
          toValue: 1.04,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(mascotBreath, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    // A barra anima a largura, e largura nao roda no driver nativo.
    const bar = Animated.timing(barProgress, {
      toValue: 1,
      duration: SPLASH_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    entrance.start();
    breath.start();
    bar.start();

    return () => {
      entrance.stop();
      breath.stop();
      bar.stop();
    };
  }, [
    mascotOpacity,
    mascotScale,
    mascotBreath,
    titleOpacity,
    subtitleOpacity,
    barProgress,
  ]);

  const barWidth = barProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Pressable style={styles.flex} onPress={onSkip}>
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
        style={styles.gradient}
      >
        {BUBBLES.map((bubble, index) => (
          <Bubble key={index} {...bubble} />
        ))}

        {TWINKLES.map((twinkle, index) => (
          <Twinkle key={index} {...twinkle} />
        ))}

        <View style={styles.mascotArea}>
          <Sunburst />
          <Halo toScale={1.9} delay={0} />
          <Halo toScale={1.5} delay={1300} />
          <Halo toScale={2.2} delay={800} />

          <Animated.View
            style={{
              opacity: mascotOpacity,
              transform: [{ scale: mascotScale }, { scale: mascotBreath }],
            }}
          >
            {/* O balanco e o brilho ja estao no GIF: nao animar de novo aqui. */}
            <Image
              source={require("../../assets/pinguim_transparente.gif")}
              style={styles.mascot}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          IntegraMente
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Aprender do seu jeito
        </Animated.Text>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>

        <Text style={styles.hint}>Toque para começar agora</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bubble: {
    position: "absolute",
    backgroundColor: "#ffffff",
  },
  mascotArea: {
    width: MASCOT_WIDTH,
    height: MASCOT_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  sunburst: {
    position: "absolute",
    width: RAY_LENGTH,
    height: RAY_LENGTH,
    alignItems: "center",
    justifyContent: "center",
  },
  ray: {
    position: "absolute",
    width: 3,
    height: RAY_LENGTH,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    opacity: 0.08,
  },
  halo: {
    position: "absolute",
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    backgroundColor: "#ffffff",
  },
  mascot: {
    width: MASCOT_WIDTH,
    height: MASCOT_HEIGHT,
  },
  title: {
    fontSize: 46,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffffb0",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 4,
  },
  barTrack: {
    width: 180,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff40",
    overflow: "hidden",
    marginTop: 40,
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#ffffff",
  },
  hint: {
    fontSize: 13,
    color: "#ffffff90",
    marginTop: 18,
  },
});