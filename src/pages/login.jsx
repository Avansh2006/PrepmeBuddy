// pages/Login.jsx
import React, { memo, useCallback, useEffect } from "react";
import { SignIn } from "@clerk/clerk-react";
import PropTypes from "prop-types";

// Constants
const ANIMATION_CLASSES = {
  container: "animate-slide-in",
  signIn: "animate-fade-in delay-200",
};

// Utility Component for Background
const AnimatedBackground = memo(() => (
  <div
    className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900"
    aria-hidden="true"
  >
    <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-subtle-pulse" />
  </div>
));

// Main Login Component
const Login = ({ path = "/login", signUpUrl = "/signup" }) => {
  // Focus management for accessibility
  const focusSignIn = useCallback(() => {
    const signInContainer = document.querySelector(".cl-signIn-root");
    if (signInContainer) {
      signInContainer.setAttribute("tabindex", "-1");
      signInContainer.focus();
    }
  }, []);

  useEffect(() => {
    focusSignIn();
  }, [focusSignIn]);

  return (
    <section
      className={`relative flex items-center justify-center min-h-screen p-4 overflow-hidden ${ANIMATION_CLASSES.container}`}
      aria-labelledby="login-title"
    >
      <AnimatedBackground />
      <div className="relative z-10 max-w-md w-full space-y-6">
        <header className="text-center">
          <h1
            id="login-title"
            className="text-3xl font-extrabold text-gray-100 tracking-tight md:text-4xl bg-gradient-to-r from-gray-100 to-zinc-400 bg-clip-text text-transparent"
          >
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your account
          </p>
        </header>
        <div
          className={`bg-zinc-800/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-zinc-700/50 ${ANIMATION_CLASSES.signIn}`}
          role="region"
          aria-label="Sign-in form"
        >
          <SignIn
            path={path}
            routing="path"
            signUpUrl={signUpUrl}
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-zinc-600 hover:bg-zinc-700 text-gray-100",
                formFieldInput:
                  "bg-zinc-900 border-zinc-600 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500",
              },
            }}
            afterSignInUrl="/dashboard"
          />
        </div>
      </div>
    </section>
  );
};

// CSS Animations (Tailwind-compatible)
const animationStyles = `
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes subtlePulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.15; }
  }
  .animate-slide-in {
    animation: slideIn 0.6s ease-out forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  .delay-200 {
    animation-delay: 200ms;
  }
  .bg-grid-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v1H0zM0 0h1v40H0z'/%3E%3C/g%3E%3C/svg%3E");
  }
  .animate-subtle-pulse {
    animation: subtlePulse 4s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

// PropTypes
Login.propTypes = {
  path: PropTypes.string,
  signUpUrl: PropTypes.string,
};

// Optimizations
AnimatedBackground.displayName = "AnimatedBackground";
Login.displayName = "Login";
export default memo(Login);