import React, { memo, useCallback, useEffect } from "react";
import { SignUp } from "@clerk/clerk-react";
import PropTypes from "prop-types";

// Constants
const ANIMATION_CLASSES = {
  container: "animate-slide-in",
  signUp: "animate-fade-in delay-150",
};

// Utility Component for Background
const AnimatedBackground = memo(() => (
  <div
    className="fixed inset-0 bg-gradient-to-tr from-zinc-900 via-indigo-900/20 to-zinc-900"
    aria-hidden="true"
  >
    <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-subtle-pulse" />
  </div>
));

// Main Signup Component
const Signup = ({ path = "/signup", signInUrl = "/login" }) => {
  // Focus management for accessibility
  const focusSignUp = useCallback(() => {
    const signUpContainer = document.querySelector(".cl-signUp-root");
    if (signUpContainer) {
      signUpContainer.setAttribute("tabindex", "-1");
      signUpContainer.focus();
    }
  }, []);

  useEffect(() => {
    focusSignUp();
    // Cleanup to remove focus outline after initial load
    return () => {
      const signUpContainer = document.querySelector(".cl-signUp-root");
      if (signUpContainer) signUpContainer.removeAttribute("tabindex");
    };
  }, [focusSignUp]);

  // Handle keyboard accessibility (Escape to go back)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        window.history.back();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      className={`relative flex items-center justify-center min-h-screen p-4 overflow-hidden ${ANIMATION_CLASSES.container}`}
      aria-labelledby="signup-title"
    >
      <AnimatedBackground />
      <div className="relative z-10 max-w-md w-full space-y-6">
        {/* Header */}
        <header className="text-center">
          <h1
            id="signup-title"
            className="text-3xl font-extrabold text-gray-100 tracking-tight md:text-4xl bg-gradient-to-r from-gray-100His to-indigo-400 bg-clip-text text-transparent"
          >
            Join the Journey
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Create your account to start preparing for tech greatness
          </p>
        </header>

        {/* SignUp Form */}
        <div
          className={`bg-zinc-800/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-zinc-700/50 transition-all duration-300 ${ANIMATION_CLASSES.signUp}`}
          role="region"
          aria-label="Sign-up form"
        >
          <SignUp
            path={path}
            routing="path"
            signInUrl={signInUrl}
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-zinc-600 hover:bg-zinc-700 text-gray-100 transition-colors duration-200",
                formFieldInput:
                  "bg-zinc-900 border-zinc-600 text-gray-100 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200",
                footerActionText: "text-gray-400",
                footerActionLink:
                  "text-indigo-400 hover:text-indigo-300 transition-colors duration-200",
              },
            }}
            afterSignUpUrl="/dashboard"
          />
        </div>

        {/* Additional Info */}
        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <a
            href={signInUrl}
            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            Sign in here
          </a>
        </p>
      </div>
    </section>
  );
};

// CSS Animations (Tailwind-compatible, refined)
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
  .delay-150 {
    animation-delay: 150ms;
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
  const existingStyleSheet = document.querySelector("style[data-signup-styles]");
  if (!existingStyleSheet) {
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute("data-signup-styles", "true");
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}

// PropTypes
Signup.propTypes = {
  path: PropTypes.string,
  signInUrl: PropTypes.string,
};

// Optimizations
AnimatedBackground.displayName = "AnimatedBackground";
Signup.displayName = "Signup";
export default memo(Signup);