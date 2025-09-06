import React from "react";
import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Navbar from "@/components/Navbar/Navbar";
import UserProduct from "@/components/UserProduct/UserProduct";
import PopularProducts from "@/components/PopularProducts/PopularProducts";
import FlashSaleProducts from "@/components/FlashSaleProducts/FlashSaleProducts";
import FAQScreen from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";
import Banner from "@/components/Banner/Banner";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
        <Navbar />
        <ScrollView contentContainerStyle={styles.content}>
          <Banner
            title="Flash Sale Today!"
            subtitle="Up to 50% off on all electronics"
            imageUrl="https://static.vecteezy.com/system/resources/previews/011/871/820/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg"
            buttonText="Shop Now"
            onPress={() => console.log("Banner clicked!")}
          />
          <UserProduct />
          <PopularProducts />
          <FlashSaleProducts />
          <FAQScreen />
          <Footer />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 16,
  },
});
