import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { DarkModeProvider } from "./context/DarkModeContext";
import { UIProvider } from "./context/UIContext";

// Components & Pages
import Header from "./components/Header/Header";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";
import Home, { loader as homeLoader } from "./pages/Home/Home";

import Favourites, {
  loader as favouritesLoader,
} from "./pages/Favourites/Favourites";
import Register, { action as registerAction } from "./pages/Register/Register";
import Login, { action as loginAction } from "./pages/Login/Login";
import ProfilePage, { profileAction } from "./pages/ProfilePage/ProfilePage";
import OtpForm, { action as otpAction } from "./pages/OtpForm/OtpForm";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword, {
  changePasswordAction,
} from "./pages/ChangePassword/ChangePassword";
import NavigationProgress from "./components/NavigationProgressBar/NavigationProgress";
import RevalidateOnPageShow from "./components/RevalidateOnPageShow";
import { authRedirectLoader } from "./authRedirectLoader";

// Define routes here
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      errorElement={<Error />}
      element={
        <>
          <NavigationProgress />
          <RevalidateOnPageShow />
          <Outlet />
        </>
      }
    >
      <Route element={<Header />}>
        <Route path="/" element={<Home />} loader={homeLoader} />

        <Route
          path="/favourites"
          element={<Favourites />}
          loader={favouritesLoader}
        />
      </Route>

      <Route
        path="/login"
        element={<Login />}
        action={loginAction}
        loader={authRedirectLoader}
      />
      <Route
        path="/register"
        element={<Register />}
        action={registerAction}
        loader={authRedirectLoader}
      />
      <Route path="/profile" element={<ProfilePage />} action={profileAction} />
      <Route
        path="/verify-otp"
        element={<OtpForm />}
        action={otpAction}
        loader={authRedirectLoader}
      />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route
        path="/changePassword"
        element={<ChangePassword />}
        action={changePasswordAction}
      />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default function App() {
  return (
    <DarkModeProvider>
      <UIProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </UIProvider>
    </DarkModeProvider>
  );
}
