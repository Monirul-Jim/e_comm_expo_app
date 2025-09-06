import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useGetSingleProductQuery } from "@/redux/api/productApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/feature/cartSlice";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const navigation = useNavigation();

  // Set the header title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Product Details", // this sets the status bar name / header
    });
  }, [navigation]);

  const { data, isLoading, error } = useGetSingleProductQuery(id!);

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text>Error fetching product</Text>
      </View>
    );

  const product = data?.data;
  if (!product) return null;

  const isInCart = cartItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    if (!product || isInCart || product.stockOut) return;

    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>${product.price}</Text>

        {product.stockOut ? (
          <View style={styles.outOfStock}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        ) : isInCart ? (
          <TouchableOpacity style={[styles.button, styles.disabledButton]} disabled>
            <Text style={styles.buttonText}>Already Added</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#111", marginBottom: 8 },
  description: { fontSize: 16, color: "#555", marginBottom: 12 },
  price: { fontSize: 22, fontWeight: "bold", color: "#4f46e5", marginBottom: 20 },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  outOfStock: {
    backgroundColor: "#fee2e2",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  outOfStockText: { color: "#b91c1c", fontWeight: "600" },
});
