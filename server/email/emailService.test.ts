import { describe, it, expect } from "vitest";
import { emailTemplates, getPlanCredits } from "./emailService";

describe("Email Service", () => {
  describe("emailTemplates", () => {
    it("should generate welcome email template with correct structure", () => {
      const template = emailTemplates.welcome({
        name: "John Doe",
        plan: "Pro",
        credits: "500,000"
      });

      expect(template.subject).toContain("Welcome to OmniCortex");
      expect(template.subject).toContain("John Doe");
      expect(template.html).toContain("John Doe");
      expect(template.html).toContain("Pro");
      expect(template.html).toContain("500,000");
      expect(template.html).toContain("OmniCortex");
    });

    it("should generate payment confirmation email template", () => {
      const template = emailTemplates.paymentConfirmation({
        name: "Jane Smith",
        amount: "$99.00",
        plan: "Business",
        invoiceUrl: "https://stripe.com/invoice/123"
      });

      expect(template.subject).toContain("Payment Confirmed");
      expect(template.html).toContain("Jane Smith");
      expect(template.html).toContain("$99.00");
      expect(template.html).toContain("Business");
      expect(template.html).toContain("https://stripe.com/invoice/123");
    });

    it("should generate renewal reminder email template", () => {
      const template = emailTemplates.renewalReminder({
        name: "Bob Wilson",
        plan: "Starter",
        renewalDate: "January 15, 2026",
        amount: "$29.00"
      });

      expect(template.subject).toContain("Renewal Reminder");
      expect(template.html).toContain("Bob Wilson");
      expect(template.html).toContain("Starter");
      expect(template.html).toContain("January 15, 2026");
      expect(template.html).toContain("$29.00");
    });

    it("should generate cancellation confirmation email template", () => {
      const template = emailTemplates.cancellationConfirmation({
        name: "Alice Brown",
        plan: "Enterprise",
        endDate: "February 28, 2026"
      });

      expect(template.subject).toContain("Cancelled");
      expect(template.html).toContain("Alice Brown");
      expect(template.html).toContain("Enterprise");
      expect(template.html).toContain("February 28, 2026");
    });
  });

  describe("getPlanCredits", () => {
    it("should return correct credits for Starter plan", () => {
      expect(getPlanCredits("Starter")).toBe("100,000");
    });

    it("should return correct credits for Pro plan", () => {
      expect(getPlanCredits("Pro")).toBe("500,000");
    });

    it("should return correct credits for Business plan", () => {
      expect(getPlanCredits("Business")).toBe("2,000,000");
    });

    it("should return correct credits for Enterprise plan", () => {
      expect(getPlanCredits("Enterprise")).toBe("Unlimited");
    });

    it("should return default credits for unknown plan", () => {
      expect(getPlanCredits("Unknown")).toBe("100,000");
    });
  });
});
