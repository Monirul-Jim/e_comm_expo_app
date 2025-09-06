import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PaymentCancelPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ Payment Cancelled</Text>
      <Text style={styles.message}>You cancelled the payment.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D97706", // Tailwind's yellow-600
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#4B5563", // Tailwind's gray-600
    marginTop: 8,
    textAlign: "center",
  },
});
