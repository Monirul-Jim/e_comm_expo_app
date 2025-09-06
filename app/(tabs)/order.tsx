import { CartItem, decreaseQuantity, increaseQuantity, removeFromCart } from "@/redux/feature/cartSlice";
import { useAppSelector } from "@/redux/hooks";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

export default function CartScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useAppSelector((state:RootState) => state.auth.user);

  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const total: number = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  const handleBuyNow = async () => {
    if (!customer.name || !customer.phone || !customer.address || !customer.city) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`https://ecombackend-khaki-iota.vercel.app/api/v1/payment/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customer,
          items: cartItems,
          userId: user,
        }),
      });
      const data = await res.json();
      if (data?.redirectURL) {
        // Open in web browser
        Linking.openURL(data.redirectURL);
      } else {
        Alert.alert("Error", "Failed to initialize payment");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Your Cart is Empty 🛒</Text>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Go shopping")}>
          <Text style={styles.buttonText}>Go Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => dispatch(decreaseQuantity(item._id))}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => dispatch(increaseQuantity(item._id))}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => dispatch(removeFromCart(item._id))}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Cart 🛒</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderCartItem}
        scrollEnabled={false}
      />

      {/* Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
      </View>

      {/* Confirm / Login */}
      {!user ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={() => console.log("Go to login")}>
          <Text style={styles.buttonText}>Login to Order</Text>
        </TouchableOpacity>
      ) : !showForm ? (
        <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
          <Text style={styles.buttonText}>Confirm Order</Text>
        </TouchableOpacity>
      ) : null}

      {/* Customer Form */}
      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formHeader}>Enter Your Details</Text>
          <TextInput
            placeholder="Full Name"
            value={customer.name}
            onChangeText={(text) => setCustomer({ ...customer, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number"
            value={customer.phone}
            onChangeText={(text) => setCustomer({ ...customer, phone: text })}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Address"
            value={customer.address}
            onChangeText={(text) => setCustomer({ ...customer, address: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="City"
            value={customer.city}
            onChangeText={(text) => setCustomer({ ...customer, city: text })}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, marginBottom: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: 60, height: 60, borderRadius: 10 },
  title: { fontWeight: "600" },
  price: { color: "#4f46e5", fontWeight: "bold" },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qtyButton: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#e5e7eb", borderRadius: 5 },
  qtyText: { marginHorizontal: 8 },
  removeText: { color: "red", marginLeft: 12 },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 12 },
  totalText: { fontSize: 18, fontWeight: "bold" },
  totalAmount: { fontSize: 18, fontWeight: "bold", color: "#4f46e5" },
  button: { backgroundColor: "#4f46e5", padding: 12, borderRadius: 8, marginTop: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  form: { marginTop: 16, padding: 16, backgroundColor: "#fff", borderRadius: 10 },
  formHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
});
