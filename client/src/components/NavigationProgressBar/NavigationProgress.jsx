import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
  speed: 400,
  easing: "ease",
});

export default function NavigationProgress() {
  const navigation = useNavigation();
  const location = useLocation();

  const isRouteNavigation =
    navigation.state === "loading" &&
    navigation.location?.pathname !== location.pathname;

  useEffect(() => {
    if (isRouteNavigation) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isRouteNavigation]);

  return null;
}
