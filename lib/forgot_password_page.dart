import 'dart:convert'; // <--- JSON Parsing-gaga ithu romba mukkiyam!
import 'package:flutter/material.dart';
import 'package:firebase_forget_password/services/api_service.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  bool isLoading = false;

  Future<void> sendResetLink() async {
    final String targetEmail = emailController.text.trim();

    // 1. Email Empty Validation
    if (targetEmail.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please enter your email"),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    // 2. Email Format Validation
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(targetEmail)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please enter a valid email address"),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      // API call matching our Node.js / Express backend routing path
      final response = await ApiService.forgotPassword(targetEmail);

      if (!mounted) return;

      // 3. Handling Success Response (Status 200)
      if (response.statusCode == 200) {
        String successMessage = "Reset link sent successfully";
        
        try {
          // Backend thara json response-la irunthu message-ah mattum pirichu edukrom
          final Map<String, dynamic> data = jsonDecode(response.body);
          successMessage = data["message"] ?? successMessage;
        } catch (_) {
          // Parsing failure fallback configuration
          successMessage = response.body;
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(successMessage),
            backgroundColor: Colors.green,
          ),
        );

        // Closes page and returns back to login screen layout
        Navigator.pop(context);
      } 
      // 4. Handling Error Response (Status 400, 404, 500 etc)
      else {
        String errorMessage = "Failed to process request";
        
        try {
          final Map<String, dynamic> errorData = jsonDecode(response.body);
          errorMessage = errorData["message"] ?? errorMessage;
        } catch (_) {
          errorMessage = response.body;
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMessage),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;

      // Catching system-level layout network timeout failures
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Network Error: ${e.toString()}"),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Forgot Password"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 30),
            const Text(
              "Enter your registered email",
              style: TextStyle(
                fontSize: 18, 
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "We will send a secure validation token link straight to your mailbox.",
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
            const SizedBox(height: 25),
            TextField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: "Email Address",
                prefixIcon: Icon(Icons.email_outlined),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 35),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: isLoading ? null : sendResetLink,
                child: isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          color: Colors.blueAccent,
                          strokeWidth: 2.5,
                        ),
                      )
                    : const Text(
                        "Send Reset Link",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}