import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://10.0.2.2:3000/auth";

  // Register
  static Future<http.Response> register(
    String email,
    String password,
  ) async {
    return await http.post(
      Uri.parse("$baseUrl/register"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "email": email,
        "password": password,
      }),
    );
  }

  // Login
  static Future<http.Response> login(
    String email,
    String password,
  ) async {
    return await http.post(
      Uri.parse("$baseUrl/login"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "email": email,
        "password": password,
      }),
    );
  }

  // Forgot Password
  static Future<http.Response> forgotPassword(
    String email,
  ) async {
    return await http.post(
      Uri.parse("$baseUrl/forgot-password"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "email": email,
      }),
    );
  }

  // Reset Password
  static Future<http.Response> resetPassword(
    String email,
    String password,
  ) async {
    return await http.post(
      Uri.parse("$baseUrl/reset-password"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "email": email,
        "password": password,
      }),
    );
  }
}