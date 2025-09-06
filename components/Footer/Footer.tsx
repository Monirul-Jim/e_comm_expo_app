import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>ShopEasy</Text>

      <View style={styles.links}>
        <TouchableOpacity onPress={() => Linking.openURL("mailto:support@shopeasy.com")}>
          <Text style={styles.link}>Email Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("tel:+1234567890")}>
          <Text style={styles.link}>Call Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("https://www.shopeasy.com/faq")}>
          <Text style={styles.link}>FAQ</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.copy}>© {new Date().getFullYear()} ShopEasy. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#4f46e5",
    alignItems: "center",
  },
  brand: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  links: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  link: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  copy: {
    color: "#e0e0e0",
    fontSize: 12,
  },
});
