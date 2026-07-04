import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:app_links/app_links.dart';

import 'login_page.dart';
import 'reset_password_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final AppLinks appLinks = AppLinks();

  Widget currentPage = const LoginPage();

  @override
  void initState() {
    super.initState();

    initDeepLink();

    appLinks.uriLinkStream.listen((Uri uri) {
      openResetPage(uri);
    });
  }

  Future<void> initDeepLink() async {
    try {
      final Uri? uri = await appLinks.getInitialLink();

      if (uri != null) {
        openResetPage(uri);
      }
    } catch (_) {}
  }

  void openResetPage(Uri uri) {
    if (uri.scheme == "myapp" && uri.host == "resetpassword") {
      final email = uri.queryParameters["email"] ?? "";

      setState(() {
        currentPage = ResetPasswordPage(email: email);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: currentPage,
    );
  }
}