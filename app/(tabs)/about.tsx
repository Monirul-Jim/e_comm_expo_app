import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1616628184133-b03e1c7a8ef9?auto=format&fit=crop&w=800&q=80" }}
          style={styles.heroImage}
        />
        <Text style={styles.heroTitle}>About Our Shop</Text>
      </View>

      {/* About Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Who We Are</Text>
        <Text style={styles.sectionText}>
          We are a passionate e-commerce platform dedicated to providing the best products for your daily needs. Our goal is to make shopping seamless, enjoyable, and affordable.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          Our mission is to deliver quality products quickly and efficiently, while maintaining excellent customer service. We aim to build trust and a lasting relationship with every customer.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionText}>
          📧 Email: support@myshop.com{"\n"}
          📞 Phone: +123 456 7890{"\n"}
          🌍 Website: www.myshop.com
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for choosing us! 💜</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  hero: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111",
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4f46e5",
  },
});
