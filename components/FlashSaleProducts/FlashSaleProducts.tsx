import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useGetFlashSaleProductsQuery } from "@/redux/api/productApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/feature/cartSlice";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 20;

type ProductType = {
  _id: string;
  title: string;
  price: number;
  flashSalePrice: number;
  flashSaleStart: string;
  flashSaleEnd: string;
  image: string;
};

type CartItem = {
  _id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

// Countdown hook
const useCountdown = (endDate: string) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft("Ended");
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

// Flash Sale Card
const FlashSaleCard = ({ product }: { product: ProductType }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const isInCart = cartItems.some((item: CartItem) => item._id === product._id);
  const countdown = useCountdown(product.flashSaleEnd);

  const handleAddToCart = () => {
    if (!product || isInCart) return;
    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.flashSalePrice,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text numberOfLines={1} style={styles.title}>{product.title}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.flashPrice}>${product.flashSalePrice}</Text>
        <Text style={styles.originalPrice}>${product.price}</Text>
      </View>

      <Text style={styles.countdown}>{countdown !== "Ended" ? `⏳ ${countdown}` : "❌ Ended"}</Text>

      <TouchableOpacity
        onPress={handleAddToCart}
        disabled={isInCart}
        style={[styles.button, isInCart ? styles.buttonDisabled : null]}
      >
        <Text style={styles.buttonText}>{isInCart ? "Already Added" : "Add to Cart"}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Flash Sale Products Wrapper
export default function FlashSaleProducts() {
  const { data, isLoading, error } = useGetFlashSaleProductsQuery(null);

  if (isLoading) return <Text style={{ textAlign: "center", marginTop: 20 }}>Loading flash sale...</Text>;
  if (error) return <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>Failed to load flash sale products</Text>;

  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={styles.heading}>🔥 Flash Sale</Text>
      <FlatList
        data={data?.data}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <FlashSaleCard product={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  flashPrice: { fontSize: 14, fontWeight: "bold", color: "red", marginRight: 6 },
  originalPrice: { fontSize: 12, textDecorationLine: "line-through", color: "#888" },
  countdown: { fontSize: 12, color: "#d32f2f", marginBottom: 6 },
  button: { backgroundColor: "red", paddingVertical: 6, borderRadius: 8, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
