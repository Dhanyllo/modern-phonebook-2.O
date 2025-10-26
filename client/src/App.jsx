// src/App.jsx
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
import DetailPage, {
  loader as detailLoader,
} from "./pages/DetailPage/DetailPage";
import Login from "./pages/Login/Login";
import Register, { action as registerAction } from "./pages/Register/Register";
import ProfilePage, { profileAction } from "./pages/ProfilePage/ProfilePage";
import OtpForm from "./pages/OtpForm/OtpForm";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword, {
  changePasswordAction,
} from "./pages/ChangePassword/ChangePassword";

export default function App() {
  // Setup React Query
  const queryClient = new QueryClient();

  // Define routes here
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<Error />}>
        <Route element={<Header />}>
          <Route path="/" element={<Home />} loader={homeLoader} />
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
        <Route path="/login" element={<Login />} />
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
        <Route path="/verify-otp" element={<OtpForm />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route
          path="/change-password"
          element={<ChangePassword />}
          action={changePasswordAction}
        />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

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
