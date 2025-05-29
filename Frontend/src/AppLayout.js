import { Outlet } from "react-router-dom";
import GlobalProvider from "./context/GlobalProvider";

const AppLayout = () => {
  return (
    <GlobalProvider>
      <Outlet />
    </GlobalProvider>
  );
};

export default AppLayout;