import Header from "@renderer/components/Header";
import { useEffect, useState } from "react";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Button } from "@renderer/components/ui/button";
import { Separator } from "@renderer/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const apiKeyValue = await window.api.settingsRepo.getApiKey();
        const location = await window.api.settingsRepo.getLocation();

        setApiKey(apiKeyValue || "");

        if (!location) {
          setLatitude("");
          setLongitude("");
          return;
        }

        setLatitude(location.latitude?.toString() || "");
        setLongitude(location.longitude?.toString() || "");
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }

    loadSettings();
  }, []);

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      const lat = latitude ? parseFloat(latitude) : null;
      const lon = longitude ? parseFloat(longitude) : null;

      if ((lat === null && lon === null) || (lat !== null && lon !== null)) {
        // Save location (convert strings to numbers or null)
        await window.api.settingsRepo.setLocation(lat, lon);
      } else {
        toast.error("Please provide valid latitude and longitude values or leave them blank.");
      }

      // Save API key
      await window.api.settingsRepo.setApiKey(apiKey);

      // Show success feedback (you could add a toast notification here)
      console.log("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header pageName="Settings" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* API Key Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenRouter API Key</Label>
              <Input id="apiKey" type="password" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <p className="text-sm text-muted-foreground">Your API key is stored locally and never shared</p>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" type="number" placeholder="40.7128" step="0.0001" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" type="number" placeholder="-74.0060" step="0.0001" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">These coordinates will be used to calculate distance from each listing</p>
          </div>

          {/* Save Settings Button */}
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>

          <Separator className="my-6 mb-40" />

          {/* Data Management Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Erase All Listings</h4>
                <p className="text-sm text-muted-foreground">Delete all saved, pending, and discarded listings</p>
              </div>
              <Button variant="destructive">Erase Listings</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
