import { domAnimation, LazyMotion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/app-layout";
import ProtectedRoute from "./layout/protected-route";
import JobPage from "./pages/job";
import JobListing from "./pages/jobListing";
import LandingPage from "./pages/landing";
import MyJobs from "./pages/my-jobs";
import Onboarding from "./pages/onboarding";
import PostJob from "./pages/post-job";
import SavedJobs from "./pages/saved-jobs";

const router = createBrowserRouter([
  {
    children: [
      {
        element: <LandingPage />,
        path: "/",
      },
      {
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
        path: "/onboarding",
      },
      {
        element: (
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
        ),
        path: "/jobs",
      },
      {
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
        path: "/post-job",
      },
      {
        element: (
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        ),
        path: "/my-jobs",
      },
      {
        element: (
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        ),
        path: "/saved-jobs",
      },
      {
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
        path: "/job/:id",
      },
    ],
    element: <AppLayout />,
  },
]);

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{}}
      />
    </LazyMotion>
  );
}

export default App;
