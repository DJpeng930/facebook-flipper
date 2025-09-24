import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { createBrowserRouter, RouterProvider } from "react-router";
import SearchPage from "./pages/SearchPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: SearchPage
  }
]);

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <RouterProvider router={router} />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
