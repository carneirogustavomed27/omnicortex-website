import { describe, it, expect } from "vitest";

describe("Hugging Face API Token Validation", () => {
  it("should have HUGGINGFACE_API_TOKEN environment variable set", () => {
    const token = process.env.HUGGINGFACE_API_TOKEN;
    expect(token).toBeDefined();
    expect(token).not.toBe("");
    expect(token?.length).toBeGreaterThan(10);
  });

  it("should validate token format (starts with hf_)", async () => {
    const token = process.env.HUGGINGFACE_API_TOKEN;
    // Hugging Face tokens typically start with "hf_"
    expect(token?.startsWith("hf_")).toBe(true);
  });

  it("should successfully authenticate with Hugging Face API", async () => {
    const token = process.env.HUGGINGFACE_API_TOKEN;
    
    // Call the whoami endpoint to validate the token
    const response = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok).toBe(true);
    
    const data = await response.json();
    // Should return user info if token is valid
    expect(data).toHaveProperty("name");
  });

  it("should be able to list models from the API", async () => {
    const token = process.env.HUGGINGFACE_API_TOKEN;
    
    // Try to list some public models (doesn't require special permissions)
    const response = await fetch("https://huggingface.co/api/models?limit=1", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
