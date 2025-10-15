import { StrictMode, useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Home, { loader as homeloader } from "./pages/Home/Home";
import Favourites, {
  loader as favouritesLoader,
} from "./pages/Favourites/Favourites";
import DetailPage, {
  loader as detailLoader,
} from "./pages/DetailPage/DetailPage";
import Header from "./components/Header/Header";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";
import Login2 from "./pages/Login2/Login2";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Register, { action as registerAction } from "./pages/Register/Register";
import OtpForm, { otpAction } from "./pages/OtpForm/OtpForm";
import ProfilePage, { profileAction } from "./pages/ProfilePage/ProfilePage";
import ChangePassword, {
  changePasswordAction,
} from "./pages/ChangePassword/ChangePassword";
import { DarkModeProvider } from "./context/DarkModeContext";

function App() {
  // function useDarkMode() {
  //   const [darkMode, setDarkMode] = useState(() => {
  //     return localStorage.getItem("darkMode") === "true";
  //   });

  //   useEffect(() => {
  //     localStorage.setItem("darkMode", darkMode);
  //   }, [darkMode]);
  //   return [darkMode, setDarkMode];
  // }

  // const [darkMode, setDarkMode] = useDarkMode();

  const queryClient = new QueryClient();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route errorElement={<Error />}>
          <Route element={<Header />}>
            <Route path="/" element={<Home />} loader={homeloader} />
            <Route
              path="/favourites"
              element={<Favourites />}
              loader={favouritesLoader}
            />
          </Route>

          <Route
            path="/detail/:id"
            element={<DetailPage />}
            loader={detailLoader}
          />

          <Route
            path="/login2"
            element={<Login2 />}
            // loader={detailLoader}
          />

          <Route
            path="/login"
            element={<Login />}
            // loader={detailLoader}
          />

          <Route
            path="/register"
            element={<Register />}
            action={registerAction}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
            action={profileAction}
          />

          <Route
            path="/verify-otp"
            element={<OtpForm />}
            // action={otpAction}
          />

          <Route
            path="/resetPassword"
            element={<ResetPassword />}
            // loader={detailLoader}
          />

          <Route
            path="/change-password"
            element={<ChangePassword />}
            action={changePasswordAction}
          />

          <Route
            path="/forgotPassword"
            element={<ForgotPassword />}
            // loader={detailLoader}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </>
    )
  );

  return (
    <StrictMode>
      <DarkModeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </DarkModeProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);
