import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { useGetUserOrdersQuery } from "@/redux/api/orderApi";

export type OrderItem = {
  _id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export type Order = {
  _id: string;
  tran_id: string;
  amount: number;
  currency: string;
  items: OrderItem[];
  orderStatus:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "RETURNED"
    | "ON_ARRIVAL_PENDING"
    | "ON_ARRIVAL_DELIVERED";
};

export default function UserOrdersList() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = useAppSelector((state) => state.auth.user);
  const { data: orders, isLoading } = useGetUserOrdersQuery(user?._id ?? "", {
    skip: !user?._id,
  });

  if (!mounted) return <Text style={styles.centerText}>Loading...</Text>;
  if (isLoading) return <Text style={styles.centerText}>Loading your orders...</Text>;
  if (!orders?.data || orders.data.length === 0)
    return <Text style={styles.centerText}>No orders found.</Text>;

  const renderOrderItem = ({ item: order }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order: {order.tran_id}</Text>
      <Text
        style={[
          styles.orderStatus,
          order.orderStatus === "PENDING"
            ? styles.pending
            : order.orderStatus === "DELIVERED"
            ? styles.delivered
            : styles.otherStatus,
        ]}
      >
        {order.orderStatus}
      </Text>
      <Text style={styles.amount}>
        {order.amount} {order.currency}
      </Text>
      <FlatList
        data={order.items}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemPrice}>
                {item.price} × {item.quantity}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>My Orders</Text>
      <FlatList
        data={orders.data}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  centerText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  orderCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  orderId: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  orderStatus: { fontSize: 14, fontWeight: "600", marginBottom: 4, padding: 4, borderRadius: 6, alignSelf: "flex-start" },
  pending: { backgroundColor: "#FEF3C7", color: "#B45309" },
  delivered: { backgroundColor: "#D1FAE5", color: "#065F46" },
  otherStatus: { backgroundColor: "#E5E7EB", color: "#374151" },
  amount: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  itemCard: { flexDirection: "row", alignItems: "center", marginRight: 12, backgroundColor: "#F9FAFB", padding: 8, borderRadius: 10 },
  itemImage: { width: 48, height: 48, borderRadius: 8, marginRight: 8 },
  itemInfo: {},
  itemTitle: { fontSize: 14, fontWeight: "500" },
  itemPrice: { fontSize: 12, color: "#6B7280" },
});
