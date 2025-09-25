export default function TestPage() {
  async function handleClick() {
    const l = await window.api.getFBMarketListings({
      query: "laptop",
      numListings: 10
    });

    console.log(l);
  }

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={handleClick}>Get Listings</button>
    </div>
  );
}
