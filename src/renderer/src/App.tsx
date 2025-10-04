import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router";
import SearchPage from "./pages/SearchPage";
import TestPage from "./pages/TestPage";
import { UserProvider, useUser } from "./contexts/UserContext";
import { SearchProvider } from "./contexts/SearchContext";
import LoginPage from "./pages/LoginPage";
import AuthLoadingPage from "./pages/AuthLoadingPage";
import PendingReviewPage from "./pages/PendingReviewPage";
import SavedPage from "./pages/SavedPage";
import DiscardedPage from "./pages/DiscardedPage";
import SettingsPage from "./pages/SettingsPage";

// Layout component with sidebar for most pages
function SidebarLayout() {
  const { user, loading } = useUser();

  if (loading) {
    return <AuthLoadingPage />;
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
      },
      {
        path: "pending-review",
        Component: PendingReviewPage
      },
      {
        path: "saved",
        Component: SavedPage
      },
      {
        path: "discarded",
        Component: DiscardedPage
      },
      {
        path: "settings",
        Component: SettingsPage
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
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </UserProvider>
  );
}

export default App;
