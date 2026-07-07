import { Outlet } from "react-router-dom";
import Header from "../components/header";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <Header />
      <main className="min-h-screen mx-auto max-w-7xl px-4">
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by RoadsideCoder
      </div>
    </div>
  );
};

export default AppLayout;