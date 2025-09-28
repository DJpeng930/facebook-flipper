import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router";
import SearchPage from "./pages/SearchPage";
import TestPage from "./pages/TestPage";
import { UserProvider, useUser } from "./contexts/UserContext";
import LoginPage from "./pages/LoginPage";
import LoadingPage from "./pages/LoadingPage";

// Layout component with sidebar for most pages
function SidebarLayout() {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    //redirect to login page
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

// Layout component without sidebar for login page
function NoSidebarLayout() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: SidebarLayout,
    children: [
      {
        index: true,
        Component: SearchPage
      },
      {
        path: "test",
        Component: TestPage
      }
    ]
  },
  {
    path: "/login",
    Component: NoSidebarLayout,
    children: [
      {
        index: true,
        Component: LoginPage
      }
    ]
  }
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
