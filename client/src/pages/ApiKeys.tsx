import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Key, Plus, Copy, Trash2, Eye, EyeOff, AlertTriangle, Check, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  expiresAt: Date | null;
  isActive: number | null;
}

export default function ApiKeys() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(["read"]);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Fetch API keys
  const { data: apiKeys, isLoading, refetch } = trpc.apiKeys.list.useQuery();
  
  // Mutations
  const createKeyMutation = trpc.apiKeys.create.useMutation({
    onSuccess: (data) => {
      setNewlyCreatedKey(data.key);
      refetch();
      toast.success("API Key created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create API key");
    },
  });

  const revokeKeyMutation = trpc.apiKeys.revoke.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("API Key revoked");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to revoke API key");
    },
  });

  const deleteKeyMutation = trpc.apiKeys.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("API Key deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete API key");
    },
  });

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }
    createKeyMutation.mutate({
      name: newKeyName,
      permissions: newKeyPermissions as ("read" | "write" | "inference")[],
    });
  };

  const handleCopyKey = async (key: string, keyId: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKeyId(keyId);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setNewKeyName("");
    setNewKeyPermissions(["read"]);
    setNewlyCreatedKey(null);
  };

  const togglePermission = (permission: string) => {
    setNewKeyPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const parsePermissions = (permissions: string | null): string[] => {
    if (!permissions) return ["read"];
    try {
      return JSON.parse(permissions);
    } catch {
      return ["read"];
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">API Keys</h1>
            <p className="text-gray-400 mt-1">
              Manage your API keys for accessing OmniCortex models
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              {!newlyCreatedKey ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New API Key</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Generate a new API key for accessing OmniCortex AI models.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName" className="text-white">Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production API Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white">Permissions</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="perm-read"
                            checked={newKeyPermissions.includes("read")}
                            onCheckedChange={() => togglePermission("read")}
                          />
                          <label htmlFor="perm-read" className="text-sm text-gray-300">
                            <span className="font-medium">Read</span> - List models and datasets
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="perm-write"
                            checked={newKeyPermissions.includes("write")}
                            onCheckedChange={() => togglePermission("write")}
                          />
                          <label htmlFor="perm-write" className="text-sm text-gray-300">
                            <span className="font-medium">Write</span> - Upload models and data
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="perm-inference"
                            checked={newKeyPermissions.includes("inference")}
                            onCheckedChange={() => togglePermission("inference")}
                          />
                          <label htmlFor="perm-inference" className="text-sm text-gray-300">
                            <span className="font-medium">Inference</span> - Run model predictions
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseCreateDialog} className="border-slate-600 text-gray-300">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateKey}
                      disabled={createKeyMutation.isPending}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black"
                    >
                      {createKeyMutation.isPending ? "Creating..." : "Create Key"}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      API Key Created
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Copy your API key now. You won't be able to see it again!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="bg-slate-800 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 text-sm font-medium">
                          Save this key securely - it won't be shown again
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <code className="flex-1 bg-slate-900 px-3 py-2 rounded text-cyan-400 text-sm font-mono break-all">
                          {newlyCreatedKey}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyKey(newlyCreatedKey, "new")}
                          className="border-slate-600"
                        >
                          {copiedKeyId === "new" ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleCloseCreateDialog}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black w-full"
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* API Keys List */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              Your API Keys
            </CardTitle>
            <CardDescription className="text-gray-400">
              Use these keys to authenticate API requests to OmniCortex
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : !apiKeys || apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No API Keys</h3>
                <p className="text-gray-400 mb-4">
                  Create your first API key to start using OmniCortex models
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Key
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key: ApiKey) => (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-slate-800/50 rounded-lg p-4 border ${
                      key.isActive ? "border-slate-700" : "border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${key.isActive ? "bg-cyan-500/20" : "bg-red-500/20"}`}>
                          <Key className={`w-5 h-5 ${key.isActive ? "text-cyan-400" : "text-red-400"}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-white flex items-center gap-2">
                            {key.name}
                            {!key.isActive && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                                Revoked
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <code className="text-sm text-gray-400 font-mono">
                              {key.keyPrefix}...
                            </code>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Created {new Date(key.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Permissions badges */}
                        <div className="flex gap-1 mr-4">
                          {parsePermissions(key.permissions).map((perm) => (
                            <span
                              key={perm}
                              className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                        {key.isActive ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => revokeKeyMutation.mutate({ keyId: key.id })}
                            disabled={revokeKeyMutation.isPending}
                            className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Revoke
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteKeyMutation.mutate({ keyId: key.id })}
                            disabled={deleteKeyMutation.isPending}
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Documentation Preview */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Start</CardTitle>
            <CardDescription className="text-gray-400">
              Use your API key to make requests to OmniCortex
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-400 mb-2"># Example API Request</div>
              <pre className="text-cyan-400 overflow-x-auto">
{`curl -X POST https://api.omnicortex.ai/v1/inference \\
  -H "Authorization: Bearer oc_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "omnicortex-7b",
    "prompt": "Hello, how are you?",
    "max_tokens": 256
  }'`}
              </pre>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-1">Rate Limits</h4>
                <p className="text-sm text-gray-400">Based on your plan tier</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-1">Token Usage</h4>
                <p className="text-sm text-gray-400">Deducted per request</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-1">Documentation</h4>
                <p className="text-sm text-gray-400">Full API reference</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
