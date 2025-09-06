// app/category/[slug]/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useGetAllProductsQuery } from "@/redux/api/productApi";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 cards per row with padding

type Category = { _id: string; name: string };
type SubCategory = { _id: string; name: string; category: Category };
type Product = {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  image: string;
  subCategory?: SubCategory;
};

export default function CategoryScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [subSlug, setSubSlug] = useState<string | null>(null);

  const { data, isLoading } = useGetAllProductsQuery({});

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );

  if (!data?.data)
    return (
      <View style={styles.center}>
        <Text>No products found</Text>
      </View>
    );

  // Filter products by main category slug
  let products = data.data.filter(
    (p: Product) =>
      p?.subCategory?.category?.name.toLowerCase().replace(/\s+/g, "-") ===
      slug
  );

  // Extract unique subcategories with defined values only
  const subcategories = Array.from(
    new Map(
      products
        .map((p: Product) => p.subCategory)
        .filter((sc): sc is SubCategory => !!sc) // filter undefined
        .map((sc) => [
          sc._id,
          {
            id: sc._id,
            name: sc.name,
            slug: sc.name.toLowerCase().replace(/\s+/g, "-"),
          },
        ])
    ).values()
  );

  // Filter by selected subcategory
  if (subSlug) {
    products = products.filter(
      (p: Product) =>
        p?.subCategory?.name.toLowerCase().replace(/\s+/g, "-") === subSlug
    );
  }

  const renderSubcategoryButton = (sub: {
    id: string;
    name: string;
    slug: string;
  }) => (
    <TouchableOpacity
      key={sub.id}
      onPress={() => setSubSlug(subSlug === sub.slug ? null : sub.slug)}
      style={[
        styles.subButton,
        subSlug === sub.slug ? styles.subButtonActive : null,
      ]}
    >
      <Text
        style={[
          styles.subButtonText,
          subSlug === sub.slug ? styles.subButtonTextActive : null,
        ]}
      >
        {sub.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/category/[slug]/product/[id]",
          params: { slug: slug, id: item._id },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.productTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.price}>${item.discountPrice || item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Header / Status Bar Title */}
      <Stack.Screen
        options={{
          title: "Product",
          headerStyle: { backgroundColor: "#f9f9f9" },
          headerTintColor: "#4f46e5",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>{slug?.replace("-", " ")}</Text>

        {/* Subcategory buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subButtonContainer}
        >
          <TouchableOpacity
            onPress={() => setSubSlug(null)}
            style={[
              styles.subButton,
              subSlug === null ? styles.subButtonActive : null,
            ]}
          >
            <Text
              style={[
                styles.subButtonText,
                subSlug === null ? styles.subButtonTextActive : null,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {subcategories.map(renderSubcategoryButton)}
        </ScrollView>

        {/* Products Grid */}
        {products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={renderProductCard}
            scrollEnabled={false} // allow ScrollView to handle scrolling
            contentContainerStyle={{ paddingBottom: 20, marginTop: 16 }}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No products found in this subcategory.
          </Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    marginBottom: 16,
  },
  subButtonContainer: { flexDirection: "row", marginBottom: 16 },
  subButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  subButtonActive: { backgroundColor: "#4f46e5" },
  subButtonText: { color: "#374151", fontWeight: "500" },
  subButtonTextActive: { color: "#fff" },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  productTitle: { fontSize: 14, fontWeight: "600", color: "#333" },
  price: { fontSize: 14, fontWeight: "bold", color: "#4f46e5" },
});
