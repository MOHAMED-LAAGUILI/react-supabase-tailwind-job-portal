import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import Header from "./header";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <Header />
      <main className="min-h-screen mx-auto max-w-7xl px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
