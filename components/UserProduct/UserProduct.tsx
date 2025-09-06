import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_SIZE = width / 2 - 20;

type Category = {
  _id: string;
  name: string;
  imageUrl: string;
};

type SubCategory = {
  category: Category;
};

type Product = {
  _id: string;
  title: string;
  price: number;
  subCategory?: SubCategory;
};

export default function UserProduct() {
  const router = useRouter();
  const { data, isLoading } = useGetAllProductsQuery({});

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10, color: "#555" }}>Loading...</Text>
      </View>
    );
  }

  if (!data?.data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#555" }}>No categories found</Text>
      </View>
    );
  }

  // ✅ Extract unique categories
  const categories = Array.from(
    new Map(
      data.data.map((p: Product) => [
        p?.subCategory?.category?._id,
        {
          name: p?.subCategory?.category?.name,
          slug: p?.subCategory?.category?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, "-"),
          imageUrl: p?.subCategory?.category?.imageUrl,
        },
      ])
    ).values()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Category</Text>

      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => String(item.slug)}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/category/[slug]",
                params: { slug: item.slug },
              })
            }
          >
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});
