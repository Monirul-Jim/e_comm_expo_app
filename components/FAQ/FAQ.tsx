import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question: "How do I place an order?",
    answer: "You can browse products, add them to your cart, and then proceed to checkout.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept credit/debit cards, mobile banking, and online wallets.",
  },
  {
    question: "Can I return a product?",
    answer: "Yes, you can return a product within 7 days of delivery if it is in original condition.",
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is shipped, you will receive a tracking number via email.",
  },
];

export default function FAQScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>

      {FAQ_DATA.map((item, index) => (
        <View key={index} style={styles.item}>
          <TouchableOpacity onPress={() => toggleExpand(index)}>
            <Text style={styles.question}>{item.question}</Text>
          </TouchableOpacity>
          {expandedIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4f46e5",
  },
  answer: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
