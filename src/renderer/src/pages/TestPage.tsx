import { useUser } from "@renderer/contexts/UserContext";

export default function TestPage() {
  const { login } = useUser();

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={login}>Get Listings</button>
    </div>
  );
}
