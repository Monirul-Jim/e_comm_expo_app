import React from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";

type BannerProps = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  onPress?: () => void;
};

export default function Banner({ title, subtitle, imageUrl, buttonText, onPress }: BannerProps) {
  return (
    <ImageBackground source={{ uri: imageUrl }} style={styles.banner} imageStyle={styles.image}>
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {buttonText && onPress && (
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 10,
  },
  image: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 6,
    textAlign: "center",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
