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

export const SPLASH_DURATION_MS = 10000;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BUBBLES = [
  { size: 70, left: "8%", delay: 0, duration: 7000 },
  { size: 42, left: "26%", delay: 1800, duration: 8500 },
  { size: 96, left: "58%", delay: 700, duration: 9000 },
  { size: 54, left: "80%", delay: 2600, duration: 7600 },
  { size: 34, left: "44%", delay: 3800, duration: 8000 },
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
      })
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
      })
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

export default function SplashLoading({ onSkip }: SplashLoadingProps) {
  const mascotScale = useRef(new Animated.Value(0.5)).current;
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

    // A barra anima a largura, e largura nao roda no driver nativo.
    const bar = Animated.timing(barProgress, {
      toValue: 1,
      duration: SPLASH_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    entrance.start();
    bar.start();

    return () => {
      entrance.stop();
      bar.stop();
    };
  }, [mascotOpacity, mascotScale, titleOpacity, subtitleOpacity, barProgress]);

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

        <View style={styles.mascotArea}>
          <Halo toScale={1.9} delay={0} />
          <Halo toScale={1.5} delay={1300} />

          <Animated.View
            style={{
              opacity: mascotOpacity,
              transform: [{ scale: mascotScale }],
            }}
          >
            {/* O balanco e o brilho ja estao no GIF: nao animar de novo aqui. */}
            <Image
              source={require("../../assets/mascote-splash.gif")}
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
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#ffffff",
  },
  mascot: {
    width: 240,
    height: 240,
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
