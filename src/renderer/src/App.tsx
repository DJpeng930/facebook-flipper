import { useState } from "react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //   async function checkLoginStatus() {
  //     //wait for api to be ready
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     const res = await window.api.checkForFBSession();
  //     setLoggedIn(res);
  //     console.log("Initial logged status:", res);
  //   }
  //   checkLoginStatus();
  // }, []);

  async function handleClick() {
    const res = await window.api.checkForFBSession();
    setLoggedIn(res);
    console.log("Logged status:", res);
  }

  async function handleLogin() {
    const res = await window.api.openFBLogin();
    setLoggedIn(res);
    console.log("Login success:", res);
  }
  async function handleLogout() {
    await window.api.fbLogOut();
    setLoggedIn(false);
    console.log("Logged out");
  }

  async function handleGetMarketListings() {
    const settings = {
      numListings: 10,
      location: "Sydney",
      minPrice: 100,
      maxPrice: 500
    };
    const listings = await window.api.getFBMarketListings(settings);
    console.log("Market listings:", listings);
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          FacebookScraper
          <Button onClick={handleLogin}>Log in</Button>
          <Button onClick={handleClick}>Check login status</Button>
          <Button onClick={handleLogout}>Log out</Button>
          <Button onClick={handleGetMarketListings}>Get Market Listings</Button>
          <Label>{loggedIn ? "Logged in" : "Not logged in"}</Label>
        </a>
      </div>
    </div>
  );
}

export default App;
