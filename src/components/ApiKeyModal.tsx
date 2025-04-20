
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { toast } from "sonner";
import { AIAnalysisService } from "@/services/aiAnalysisService";

interface ApiKeyModalProps {
  onApiKeySet: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  // Check if key exists in localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      AIAnalysisService.setApiKey(storedKey);
      setHasStoredKey(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    try {
      // Store in localStorage (note: in a production app, this would be stored more securely)
      localStorage.setItem('openai_api_key', apiKey);
      
      // Set the key in the service
      AIAnalysisService.setApiKey(apiKey);
      
      toast.success("API key saved successfully");
      setHasStoredKey(true);
      setOpen(false);
      onApiKeySet();
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    AIAnalysisService.setApiKey('');
    setHasStoredKey(false);
    setApiKey('');
    toast.success("API key removed");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={hasStoredKey ? "outline" : "default"} className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          {hasStoredKey ? "Update OpenAI API Key" : "Set OpenAI API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Enter your OpenAI API key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
          <div className="flex justify-between gap-2">
            {hasStoredKey && (
              <Button variant="outline" onClick={handleClearApiKey}>
                Clear Key
              </Button>
            )}
            <Button onClick={handleSaveApiKey} className={hasStoredKey ? "" : "w-full"}>
              Save Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
