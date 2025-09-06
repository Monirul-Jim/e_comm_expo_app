import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useGetPopularProductsQuery } from "@/redux/api/productApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/feature/cartSlice";

type ProductType = {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  image: string;
};

type CartItem = {
  _id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

const { width } = Dimensions.get("window");
const PopularCard = ({ product }: { product: ProductType }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const isInCart = cartItems.some((item: CartItem) => item._id === product._id);

  const handleAddToCart = () => {
    if (!product || isInCart) return;
    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.discountPrice ?? product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>
        {product.title}
      </Text>

      <View style={styles.priceContainer}>
        {product.discountPrice ? (
          <>
            <Text style={styles.discountPrice}>${product.discountPrice}</Text>
            <Text style={styles.originalPrice}>${product.price}</Text>
          </>
        ) : (
          <Text style={styles.price}>${product.price}</Text>
        )}
      </View>

      <TouchableOpacity
        disabled={isInCart}
        onPress={handleAddToCart}
        style={[styles.button, isInCart && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>
          {isInCart ? "Already Added" : "Add to Cart"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const PopularProducts = () => {
  const { data, isLoading, error } = useGetPopularProductsQuery(null);

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10 }}>Loading popular products...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load popular products</Text>
      </View>
    );

  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.header}>⭐ Popular Products</Text>
      <FlatList
        data={data?.data}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <PopularCard product={item} />
          </View>
        )}
      />
    </View>
  );
};
export default PopularProducts;
const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 10 },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: "100%", height: 120, borderRadius: 10, marginBottom: 8 },
  title: { fontSize: 14, fontWeight: "600", color: "#333" },
  priceContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  price: { fontSize: 14, fontWeight: "bold", color: "#4f46e5" },
  discountPrice: { fontSize: 14, fontWeight: "bold", color: "#16A34A", marginRight: 6 },
  originalPrice: { fontSize: 12, color: "#9CA3AF", textDecorationLine: "line-through" },
  button: { marginTop: 8, backgroundColor: "#16A34A", paddingVertical: 6, borderRadius: 8, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#A7F3D0" },
  buttonText: { color: "white", fontSize: 12, fontWeight: "600" },
});
