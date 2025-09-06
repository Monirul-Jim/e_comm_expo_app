import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { verifyToken } from "@/components/VerifyToken/VerifyToken";
import { setUser, TUser } from "@/redux/feature/authSlice";
import { Link, useRouter } from "expo-router";
interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

type ErrorData = {
  message?: string;
};

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await loginUser(data);
    const user = verifyToken(res?.data?.data?.accessToken) as TUser;
    dispatch(setUser({ user, token: res?.data?.data?.accessToken }));
  };

  function isFetchBaseQueryError(error: unknown): error is { data: ErrorData } {
    return typeof error === "object" && error !== null && "data" in error;
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Welcome Back 👋</Text>

        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeButton}
                >
                  <Text style={{ fontSize: 18 }}>
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
              {isFetchBaseQueryError(error) && error.data?.message && (
                <Text style={styles.error}>{error.data.message}</Text>
              )}
            </View>
          )}
        />

        {/* Remember Me */}
        <Controller
          control={control}
          name="remember"
          render={({ field: { value, onChange } }) => (
            <TouchableOpacity
              onPress={() => onChange(!value)}
              style={styles.rememberContainer}
            >
              <View
                style={[styles.checkbox, value && styles.checkboxChecked]}
              />
              <Text style={{ marginLeft: 8 }}>Remember me</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Don’t have an account?{" "} <Text style={styles.registerLink}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  error: { color: "red", marginTop: 5 },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  registerText: { textAlign: "center", color: "#555" },
  registerLink: { color: "#4f46e5", fontWeight: "bold" },
  link: { color: "#4f46e5", textAlign: "center", marginTop: 10 },
});
