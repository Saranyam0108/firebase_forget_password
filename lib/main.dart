import 'dart:async';

import 'package:app_links/app_links.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

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
  final AppLinks _appLinks = AppLinks();

  StreamSubscription<Uri>? _linkSubscription;

  final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  @override
  void initState() {
    super.initState();

    _initDeepLink();

    _linkSubscription = _appLinks.uriLinkStream.listen(
      (Uri uri) {
        _openResetPage(uri);
      },
      onError: (error) {
        debugPrint("Deep Link Error: $error");
      },
    );
  }

  Future<void> _initDeepLink() async {
    try {
      final Uri? uri = await _appLinks.getInitialLink();

      if (uri != null) {
        _openResetPage(uri);
      }
    } catch (e) {
      debugPrint("Initial Link Error: $e");
    }
  }

  void _openResetPage(Uri uri) {
    if (uri.scheme == "myapp" &&
        uri.host == "resetpassword") {
      final email = uri.queryParameters["email"] ?? "";

      navigatorKey.currentState?.push(
        MaterialPageRoute(
          builder: (_) => ResetPasswordPage(email: email),
        ),
      );
    }
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorKey,
      debugShowCheckedModeBanner: false,
      title: "Forgot Password",
      home: const LoginPage(),
    );
  }
}