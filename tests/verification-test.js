/**
 * CV Editor Verification Test Suite
 * Comprehensive testing of all requirements using Bun test framework
 */

import { test, expect, describe, beforeAll, afterAll } from "bun:test";

const BASE_URL = "http://localhost:3000";
const TEST_TIMEOUT = 30000;

// Test data for validation
const TEST_CV_DATA = {
  profile: {
    name: "Test User",
    jobRole: "Test Engineer",
    summary: "Test summary for verification",
    image: "https://example.com/test.jpg"
  },
  sidebar: [
    {
      title: "Contact",
      subsections: [
        {
          type: "contact",
          items: [
            { icon: "phone", text: "+44 123 456 789" }
          ]
        }
      ]
    }
  ],
  main: [
    {
      title: "Experience",
      subsections: [
        {
          type: "experience",
          items: [
            {
              heading: "Test Position",
              subheading: "Test Company",
              period: "2023-Present",
              content: "Test experience content"
            }
          ]
        }
      ]
    }
  ],
  styling: {
    colors: {
      primary: "#666",
      accent: "#2c5f6f"
    }
  }
};

describe("CV Editor Requirements Verification", () => {

  describe("1. Two-URL Architecture", () => {
    test("/ route should show read-only CV with Edit CV button", async () => {
      const response = await fetch(`${BASE_URL}/`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/html");

      const html = await response.text();
      expect(html).toContain("<!doctype html>");
      expect(html).toContain("Test User"); // Should show CV content
      expect(html).not.toContain("CV Editor"); // Should not contain editor interface
    });

    test("/edit route should show split-view editor", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/html");

      const html = await response.text();
      expect(html).toContain("CV Editor");
      expect(html).toContain("split-container");
      expect(html).toContain("editor-panel");
      expect(html).toContain("preview-panel");
    });
  });

  describe("2. Split-view Layout Verification", () => {
    test("/edit page should contain required layout elements", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      const html = await response.text();

      // Check for toolbar
      expect(html).toContain("toolbar");
      expect(html).toContain("Save Changes");
      expect(html).toContain("Create Backup");
      expect(html).toContain("View CV");

      // Check for split container
      expect(html).toContain("split-container");
      expect(html).toContain("editor-panel");
      expect(html).toContain("preview-panel");

      // Check for editor tabs
      expect(html).toContain("JSON Editor");
      expect(html).toContain("Form Editor");

      // Check for live preview
      expect(html).toContain("Live Preview");
      expect(html).toContain("preview-content");
    });

    test("Editor should load required JavaScript and CSS files", async () => {
      const editorJsResponse = await fetch(`${BASE_URL}/editor.js`);
      expect(editorJsResponse.status).toBe(200);
      expect(editorJsResponse.headers.get("content-type")).toContain("application/javascript");

      const editStylesResponse = await fetch(`${BASE_URL}/edit-styles.css`);
      expect(editStylesResponse.status).toBe(200);
      expect(editStylesResponse.headers.get("content-type")).toContain("text/css");
    });
  });

  describe("3. JSON Editor Requirements", () => {
    test("Edit page should include Monaco editor setup", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      const html = await response.text();

      // Check for Monaco editor CDN
      expect(html).toContain("monaco-editor");
      expect(html).toContain("vs/loader.js");

      // Check for JSON editor container
      expect(html).toContain("json-editor");
      expect(html).toContain("json-editor-container");
    });

    test("Editor.js should contain Monaco initialization", async () => {
      const response = await fetch(`${BASE_URL}/editor.js`);
      const content = await response.text();

      expect(content).toContain("monaco.editor.create");
      expect(content).toContain("language: 'json'");
      expect(content).toContain("initMonacoEditor");
    });
  });

  describe("4. Form Editor Requirements", () => {
    test("Form editor should contain profile fields", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      const html = await response.text();

      // Check for profile form fields
      expect(html).toContain("profile-name");
      expect(html).toContain("profile-job-role");
      expect(html).toContain("profile-summary");
      expect(html).toContain("profile-image");

      // Check for character count elements
      expect(html).toContain("char-count");
      expect(html).toContain("maxlength");
    });

    test("Form editor should have section management", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      const html = await response.text();

      expect(html).toContain("sidebar-sections");
      expect(html).toContain("main-sections");
      expect(html).toContain("Add Section");
    });
  });

  describe("5. API Endpoints Verification", () => {
    test("GET /api/cv/data should return CV data", async () => {
      const response = await fetch(`${BASE_URL}/api/cv/data`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/json");

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.profile).toBeDefined();
    });

    test("POST /api/cv/save should save CV data", async () => {
      const response = await fetch(`${BASE_URL}/api/cv/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: TEST_CV_DATA,
          createBackup: false
        })
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.success).toBe(true);
    });

    test("POST /api/cv/save should create backup when requested", async () => {
      const response = await fetch(`${BASE_URL}/api/cv/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: TEST_CV_DATA,
          createBackup: true
        })
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.backupCreated).toBeDefined();
      expect(result.backupCreated).toContain("cv.json.backup.");
    });

    test("GET /api/cv/backups should list backup files", async () => {
      const response = await fetch(`${BASE_URL}/api/cv/backups`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/json");

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.backups)).toBe(true);
    });

    test("API should handle invalid data gracefully", async () => {
      const response = await fetch(`${BASE_URL}/api/cv/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: "invalid data",
          createBackup: false
        })
      });

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid data format");
    });

    test("API should handle malformed JSON gracefully", async () => {
      const response = await fetch(`${BASE_URL}/api/cv/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: "invalid json"
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.success).toBe(false);
    });
  });

  describe("6. Auto-save Functionality", () => {
    test("Editor.js should contain auto-save implementation", async () => {
      const response = await fetch(`${BASE_URL}/editor.js`);
      const content = await response.text();

      // Check for auto-save related code
      expect(content).toContain("autoSave");
      expect(content).toContain("startAutoSave");
      expect(content).toContain("isDirty");

      // Should contain interval timing (5000ms = 5 seconds)
      expect(content).toContain("5000");
    });

    test("Save status element should be present", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      const html = await response.text();

      expect(html).toContain("save-status");
      expect(html).toContain("Auto-saved");
    });
  });

  describe("7. Manual Save and Backup Features", () => {
    test("Manual save buttons should be present", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      const html = await response.text();

      expect(html).toContain("manual-save-btn");
      expect(html).toContain("create-backup-btn");
      expect(html).toContain("Save Changes");
      expect(html).toContain("Create Backup");
    });
  });

  describe("8. Real-time Sync Features", () => {
    test("Editor should contain sync functionality", async () => {
      const response = await fetch(`${BASE_URL}/editor.js`);
      const content = await response.text();

      // Check for sync-related methods
      expect(content).toContain("sync");
      expect(content).toContain("populateFormFromData");
      expect(content).toContain("syncFormToJson");
      expect(content).toContain("syncJsonToForm");
      expect(content).toContain("syncPreview");
    });
  });

  describe("9. Live Preview Requirements", () => {
    test("Preview panel should contain StencilJS components", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      const html = await response.text();

      // Check for StencilJS component script
      expect(html).toContain("cv-components.esm.js");

      // Check for CV components in preview
      expect(html).toContain("cv-display");
      expect(html).toContain("cv-profile-image");
      expect(html).toContain("cv-header");
      expect(html).toContain("cv-generic-section");
    });

    test("Preview should have initial CV data", async () => {
      const response = await fetch(`${BASE_URL}/edit`);
      const html = await response.text();

      // Check for initial data injection
      expect(html).toContain("window.cvData");
      expect(html).toContain("Test User"); // Should contain the actual rendered data
    });
  });

  describe("10. Error Handling", () => {
    test("Should handle 404 routes gracefully", async () => {
      const response = await fetch(`${BASE_URL}/nonexistent-route`);
      expect(response.status).toBe(404);

      const text = await response.text();
      expect(text).toContain("Not Found");
    });

    test("Editor should contain error handling for invalid JSON", async () => {
      const response = await fetch(`${BASE_URL}/editor.js`);
      const content = await response.text();

      expect(content).toContain("try");
      expect(content).toContain("catch");
      expect(content).toContain("error");
    });
  });

  describe("11. Component Integration", () => {
    test("StencilJS components should be accessible", async () => {
      const response = await fetch(`${BASE_URL}/dist/cv-components/cv-components.esm.js`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/javascript");
    });

    test("CSS files should be accessible", async () => {
      const stylesResponse = await fetch(`${BASE_URL}/styles.css`);
      expect(stylesResponse.status).toBe(200);

      const resetResponse = await fetch(`${BASE_URL}/reset.css`);
      expect(resetResponse.status).toBe(200);
    });
  });

  describe("12. Template Integration", () => {
    test("Templates should use Handlebars helpers", async () => {
      const indexResponse = await fetch(`${BASE_URL}/`);
      const indexHtml = await indexResponse.text();

      const editResponse = await fetch(`${BASE_URL}/edit`);
      const editHtml = await editResponse.text();

      // Check for custom CSS injection
      expect(indexHtml).toContain(":root {");
      expect(indexHtml).toContain("--color-");

      // Check for JSON helper usage in edit template
      expect(editHtml).toContain("window.cvData");
    });
  });
});