import { clearCart } from "@/redux/feature/cartSlice";
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

export default function PaymentSuccessPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear local cart after successful payment
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Payment Successful!</Text>
      <Text style={styles.message}>Thank you for your purchase.</Text>
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
    color: "#16A34A", // Tailwind green-600
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#4B5563", // Tailwind gray-600
    marginTop: 8,
    textAlign: "center",
  },
});
