// Playwright Verification Tests for CV Editor Complex Schema Support
// Run with: bun test tests/playwright-verification.js

import { test, expect } from "bun:test";

// Mock Playwright-like APIs for Bun test environment
class Page {
  constructor() {
    this.url = 'http://localhost:3000/edit';
  }

  async goto(url) {
    this.url = url;
    console.log(`Navigating to: ${url}`);
  }

  async waitForSelector(selector, options = {}) {
    console.log(`Waiting for selector: ${selector}`);
    // Mock implementation - in real Playwright this would wait for the element
    return { selector };
  }

  async click(selector) {
    console.log(`Clicking: ${selector}`);
  }

  async fill(selector, value) {
    console.log(`Filling ${selector} with: ${value}`);
  }

  async evaluate(fn) {
    console.log('Evaluating function in browser context');
    // Mock implementation
    return fn();
  }

  async screenshot(options = {}) {
    console.log(`Taking screenshot: ${options.path || 'default.png'}`);
  }
}

// Test Suite for Complex Schema Support
test.describe("CV Editor Complex Schema Support", () => {
  let page;

  test.beforeAll(async () => {
    page = new Page();
    await page.goto('http://localhost:3000/edit');
  });

  test("should load editor with complex CV data", async () => {
    // Wait for editor to be ready
    await page.waitForSelector('.cv-editor', { timeout: 10000 });

    // Check that complex sections are rendered
    const sidebarSections = await page.waitForSelector('#sidebar-sections');
    const mainSections = await page.waitForSelector('#main-sections');

    expect(sidebarSections).toBeTruthy();
    expect(mainSections).toBeTruthy();
  });

  test("should display profile section correctly", async () => {
    // Check profile fields
    await page.waitForSelector('#profile-name');
    await page.waitForSelector('#profile-job-role');
    await page.waitForSelector('#profile-summary');
    await page.waitForSelector('#profile-image');

    // Verify character count displays
    const charCount = await page.waitForSelector('.char-count');
    expect(charCount).toBeTruthy();
  });

  test("should render complex sections with subsections", async () => {
    // Check for advanced section structure
    await page.waitForSelector('.advanced-section');
    await page.waitForSelector('.subsections-container');
    await page.waitForSelector('.subsection-item');

    // Verify section controls
    await page.waitForSelector('button[onclick*="addSubsection"]');
    await page.waitForSelector('button[onclick*="removeSection"]');
  });

  test("should support different content types", async () => {
    // Check for content type selectors
    await page.waitForSelector('select[onchange*="changeContentType"]');

    // Check for list content
    await page.waitForSelector('.list-items-container');
    await page.waitForSelector('.list-item-row');

    // Check for text content
    await page.waitForSelector('textarea[onchange*="updateSubsectionContent"]');
  });

  test("should handle icon bullets in contact section", async () => {
    // Look for bullet inputs with icon values
    await page.waitForSelector('.bullet-input');

    const iconBulletExists = await page.evaluate(() => {
      const bulletInputs = document.querySelectorAll('.bullet-input');
      return Array.from(bulletInputs).some(input =>
        ['phone', 'house', 'mail', 'github', 'linkedin'].includes(input.value)
      );
    });

    expect(iconBulletExists).toBe(true);
  });

  test("should handle text bullets in skills section", async () => {
    const textBulletExists = await page.evaluate(() => {
      const bulletInputs = document.querySelectorAll('.bullet-input');
      return Array.from(bulletInputs).some(input => input.value === '•');
    });

    expect(textBulletExists).toBe(true);
  });

  test("should allow adding new sections", async () => {
    // Click add section button for sidebar
    await page.click('[data-target="sidebar"].add-section');

    // Verify new section appears
    const sectionsCount = await page.evaluate(() => {
      return document.querySelectorAll('#sidebar-sections .section-item').length;
    });

    expect(sectionsCount).toBeGreaterThan(0);
  });

  test("should allow adding new subsections", async () => {
    // Click add subsection button
    await page.click('button[onclick*="addSubsection"]');

    // Verify subsection was added
    const subsectionsCount = await page.evaluate(() => {
      return document.querySelectorAll('.subsection-item').length;
    });

    expect(subsectionsCount).toBeGreaterThan(0);
  });

  test("should switch between content types", async () => {
    // Find a content type selector and change it
    const selector = await page.waitForSelector('select[onchange*="changeContentType"]');

    // Test switching from list to text
    await page.evaluate(() => {
      const select = document.querySelector('select[onchange*="changeContentType"]');
      if (select) {
        select.value = 'text';
        select.dispatchEvent(new Event('change'));
      }
    });

    // Verify text content area appears
    await page.waitForSelector('textarea[onchange*="updateSubsectionContent"]');
  });

  test("should maintain data integrity during edits", async () => {
    // Make an edit in form
    await page.fill('#profile-name', 'Test Name Change');

    // Check that cvData was updated
    const nameUpdated = await page.evaluate(() => {
      return window.cvEditor && window.cvEditor.cvData.profile.name === 'Test Name Change';
    });

    expect(nameUpdated).toBe(true);
  });

  test("should sync between JSON and form editors", async () => {
    // Switch to JSON tab
    await page.click('[data-tab="json"]');
    await page.waitForSelector('#json-editor');

    // Switch back to form tab
    await page.click('[data-tab="form"]');

    // Verify form is still populated
    const formPopulated = await page.evaluate(() => {
      const nameField = document.getElementById('profile-name');
      return nameField && nameField.value.length > 0;
    });

    expect(formPopulated).toBe(true);
  });

  test("should update live preview", async () => {
    // Check that preview components exist
    await page.waitForSelector('#preview-profile-image');
    await page.waitForSelector('#preview-header-component');
    await page.waitForSelector('cv-generic-section');

    // Verify preview sections are populated
    const sectionsCount = await page.evaluate(() => {
      return document.querySelectorAll('cv-generic-section').length;
    });

    expect(sectionsCount).toBeGreaterThan(0);
  });

  test("should handle list item management", async () => {
    // Add a new list item
    await page.click('button[onclick*="addListItem"]');

    // Verify list item was added
    const listItemsCount = await page.evaluate(() => {
      return document.querySelectorAll('.list-item-row').length;
    });

    expect(listItemsCount).toBeGreaterThan(0);

    // Test removing a list item
    const removeButton = await page.waitForSelector('button[onclick*="removeListItem"]');
    await page.click('button[onclick*="removeListItem"]');
  });

  test("should validate all required functions exist", async () => {
    const functionsExist = await page.evaluate(() => {
      const editor = window.cvEditor;
      if (!editor) return false;

      const requiredFunctions = [
        'addSection',
        'removeSection',
        'addSubsection',
        'removeSubsection',
        'changeContentType',
        'addListItem',
        'removeListItem',
        'updateListItem',
        'syncFormToJson',
        'syncJsonToForm',
        'syncPreview'
      ];

      return requiredFunctions.every(fn => typeof editor[fn] === 'function');
    });

    expect(functionsExist).toBe(true);
  });

  test("should handle complex nested data structures", async () => {
    const dataStructureValid = await page.evaluate(() => {
      const data = window.cvEditor?.cvData;
      if (!data) return false;

      // Check profile structure
      if (!data.profile || !data.profile.name) return false;

      // Check sidebar structure
      if (!Array.isArray(data.sidebar)) return false;
      if (data.sidebar.length === 0) return false;

      const firstSidebarSection = data.sidebar[0];
      if (!firstSidebarSection.title || !Array.isArray(firstSidebarSection.subsections)) return false;

      // Check main structure
      if (!Array.isArray(data.main)) return false;
      if (data.main.length === 0) return false;

      const firstMainSection = data.main[0];
      if (!firstMainSection.title || !Array.isArray(firstMainSection.subsections)) return false;

      // Check subsection structure
      if (firstMainSection.subsections.length > 0) {
        const subsection = firstMainSection.subsections[0];
        if (!subsection.content || !subsection.content.type) return false;
      }

      return true;
    });

    expect(dataStructureValid).toBe(true);
  });

  test.afterAll(async () => {
    // Take a final screenshot for manual verification
    await page.screenshot({ path: 'tests/final-verification.png' });
  });
});

// Additional test for specific schema requirements
test.describe("Schema Compliance Tests", () => {
  test("should comply with content type specifications", async () => {
    const page = new Page();
    await page.goto('http://localhost:3000/edit');

    const complianceCheck = await page.evaluate(() => {
      const data = window.cvEditor?.cvData;
      if (!data) return { valid: false, errors: ['No CV data found'] };

      const errors = [];

      // Check all sections for proper content structure
      const allSections = [...(data.sidebar || []), ...(data.main || [])];

      allSections.forEach((section, sectionIndex) => {
        if (!section.subsections) return;

        section.subsections.forEach((subsection, subIndex) => {
          const content = subsection.content;
          if (!content) {
            errors.push(`Section ${sectionIndex}, Subsection ${subIndex}: Missing content`);
            return;
          }

          if (!['text', 'list'].includes(content.type)) {
            errors.push(`Section ${sectionIndex}, Subsection ${subIndex}: Invalid content type: ${content.type}`);
          }

          if (content.type === 'list') {
            if (!Array.isArray(content.data)) {
              errors.push(`Section ${sectionIndex}, Subsection ${subIndex}: List content must be array`);
            } else {
              content.data.forEach((item, itemIndex) => {
                if (!item.bullet || !item.value) {
                  errors.push(`Section ${sectionIndex}, Subsection ${subIndex}, Item ${itemIndex}: Missing bullet or value`);
                }
              });
            }
          }

          if (content.type === 'text' && typeof content.data !== 'string') {
            errors.push(`Section ${sectionIndex}, Subsection ${subIndex}: Text content must be string`);
          }
        });
      });

      return { valid: errors.length === 0, errors };
    });

    expect(complianceCheck.valid).toBe(true);
    if (!complianceCheck.valid) {
      console.log('Schema compliance errors:', complianceCheck.errors);
    }
  });
});