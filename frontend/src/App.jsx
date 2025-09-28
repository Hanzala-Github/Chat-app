import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/component";
import { useThemeStore } from "./store/useThemeStore";
import {
  HomePage,
  LoginPage,
  ProfilePage,
  SettingsPage,
  SignupPage,
} from "./pages/page";
// import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "sonner";

// import { useCheckAuth } from "./hooks/useAuthQueries";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  // const { data: authUser, isLoading: isCheckingAuth } = useCheckAuth();
  const authUser = useAuthStore((state) => state.authUser);
  const checkAuth = useAuthStore.getState().checkAuth;
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const theme = useThemeStore((state) => state.theme);

  console.log("App component");

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // .........new..........//

  // useEffect(() => {
  //   if (authUser) {
  //     console.log("User logged in:", authUser);
  //   } else {
  //     console.log("No auth user found, redirect to login maybe...");
  //   }
  // }, [authUser]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // ..............This is the jsx return part...........//

  return (
    <div data-theme={theme}>
      <Toaster richColors position="bottom-right" />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
