import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "expo-router";
import { useRegisterUserMutation } from "@/redux/api/authApi";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const {
    register: formRegister,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading, error, isSuccess }] = useRegisterUserMutation();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await registerUser(data).unwrap();
      router.push("/login");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account ✨</Text>

      {/* Success / Error messages */}
      {isSuccess && <Text style={styles.successText}>Registration successful! Please login.</Text>}
      {error && <Text style={styles.errorText}>{(error as any)?.data?.message || "Registration failed"}</Text>}

      {/* First Name */}
      <TextInput
        placeholder="First Name"
        style={styles.input}
        onChangeText={(text) => setValue("firstName", text)}
      />
      {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

      {/* Last Name */}
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        onChangeText={(text) => setValue("lastName", text)}
      />
      {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

      {/* Email */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setValue("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={[styles.input, { flex: 1 }]}
          onChangeText={(text) => setValue("password", text)}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
          <Text>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordContainer: { flexDirection: "row", alignItems: "center" },
  eyeButton: { padding: 10 },
  button: {
    height: 50,
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#4f46e5", textAlign: "center", marginTop: 10 },
  successText: { color: "green", marginBottom: 10, textAlign: "center" },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
});
