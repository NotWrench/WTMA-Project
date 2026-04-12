"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type PendingAction = "login" | "signup" | "social" | null;

const FALLBACK_AUTH_ERROR =
  "We couldn't complete that request. Please try again.";

const getAuthErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return FALLBACK_AUTH_ERROR;
};

export function AuthContainer() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isSubmitting = pendingAction !== null;

  const toggleAuth = () => {
    setErrorMessage(null);
    setIsLogin((prev) => !prev);
  };

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setPendingAction("login");

    try {
      const { error } = await authClient.signIn.email({
        email: loginForm.email,
        password: loginForm.password,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error));
        setPendingAction(null);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setPendingAction(null);
    }
  };

  const handleEmailSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setPendingAction("signup");

    try {
      const { error } = await authClient.signUp.email({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error));
        setPendingAction(null);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setPendingAction(null);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setPendingAction("social");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error));
        setPendingAction(null);
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setPendingAction(null);
    }
  };

  // Simple SVG for Google logo
  const GoogleIcon = (
    <svg
      aria-hidden="true"
      className="mr-2"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-8 shadow-xl backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex w-full flex-col gap-6"
              exit={{ opacity: 0, x: 20 }}
              initial={{ opacity: 0, x: -20 }}
              key="login"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-col gap-2 text-center">
                <h2 className="font-heading font-medium text-3xl text-foreground tracking-tight">
                  Welcome back
                </h2>
                <p className="font-light text-muted-foreground text-sm">
                  Please enter your details to sign in.
                </p>
              </div>

              <Button
                className="w-full justify-center bg-background/50 hover:bg-background/80"
                disabled={isSubmitting}
                onClick={handleGoogleAuth}
                variant="outline"
              >
                {GoogleIcon}
                {pendingAction === "social"
                  ? "Redirecting to Google..."
                  : "Sign in with Google"}
              </Button>

              <div className="relative flex items-center py-2">
                <div className="grow border-border/40 border-t" />
                <span className="mx-4 font-medium text-muted-foreground text-xs uppercase">
                  or
                </span>
                <div className="grow border-border/40 border-t" />
              </div>

              <form
                className="flex flex-col gap-4"
                onSubmit={handleEmailSignIn}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    autoComplete="email"
                    disabled={isSubmitting}
                    id="email-login"
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={loginForm.email}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-login">Password</Label>
                    <button
                      className="font-medium text-primary text-xs transition-colors hover:text-primary-dim"
                      onClick={(e) => e.preventDefault()}
                      type="button"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Input
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    id="password-login"
                    minLength={8}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    required
                    type="password"
                    value={loginForm.password}
                  />
                </div>
                <Button
                  className="mt-2 w-full"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {pendingAction === "login" ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {errorMessage ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-destructive text-sm">
                  {errorMessage}
                </p>
              ) : null}

              <p className="text-center text-muted-foreground text-sm">
                Don&apos;t have an account?{" "}
                <button
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={toggleAuth}
                  type="button"
                >
                  Sign up for free
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex w-full flex-col gap-6"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              key="signup"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-col gap-2 text-center">
                <h2 className="font-heading font-medium text-3xl text-foreground tracking-tight">
                  Create an account
                </h2>
                <p className="font-light text-muted-foreground text-sm">
                  Sign up to begin your mindful journey.
                </p>
              </div>

              <Button
                className="w-full justify-center bg-background/50 hover:bg-background/80"
                disabled={isSubmitting}
                onClick={handleGoogleAuth}
                variant="outline"
              >
                {GoogleIcon}
                {pendingAction === "social"
                  ? "Redirecting to Google..."
                  : "Sign up with Google"}
              </Button>

              <div className="relative flex items-center py-2">
                <div className="grow border-border/40 border-t" />
                <span className="mx-4 font-medium text-muted-foreground text-xs uppercase">
                  or
                </span>
                <div className="grow border-border/40 border-t" />
              </div>

              <form
                className="flex flex-col gap-4"
                onSubmit={handleEmailSignUp}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name-signup">Full Name</Label>
                  <Input
                    autoComplete="name"
                    disabled={isSubmitting}
                    id="name-signup"
                    onChange={(event) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="John Doe"
                    required
                    type="text"
                    value={signupForm.name}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    autoComplete="email"
                    disabled={isSubmitting}
                    id="email-signup"
                    onChange={(event) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={signupForm.email}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    id="password-signup"
                    minLength={8}
                    onChange={(event) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    required
                    type="password"
                    value={signupForm.password}
                  />
                </div>

                <Button
                  className="mt-2 w-full"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {pendingAction === "signup"
                    ? "Creating account..."
                    : "Sign Up"}
                </Button>
              </form>

              {errorMessage ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-destructive text-sm">
                  {errorMessage}
                </p>
              ) : null}

              <p className="text-center text-muted-foreground text-sm">
                Already have an account?{" "}
                <button
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={toggleAuth}
                  type="button"
                >
                  Sign in
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-6 font-light text-muted-foreground text-sm">
        <a className="transition-colors hover:text-foreground" href="/">
          Privacy Policy
        </a>
        <a className="transition-colors hover:text-foreground" href="/">
          Terms of Service
        </a>
        <a className="transition-colors hover:text-foreground" href="/">
          Contact Support
        </a>
      </div>
    </div>
  );
}
