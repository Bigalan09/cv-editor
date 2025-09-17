// CV Editor Complex Schema Support Tests
// Run with: bun test

import { test, expect } from "bun:test";

test("CV data structure should be valid", async () => {
    // Read the CV data file
    const file = Bun.file("cv.json");
    const cvData = await file.json();

    // Verify basic structure
    expect(cvData).toBeDefined();
    expect(cvData.profile).toBeDefined();
    expect(cvData.sidebar).toBeInstanceOf(Array);
    expect(cvData.main).toBeInstanceOf(Array);

    // Verify profile structure
    expect(cvData.profile.name).toBeDefined();
    expect(cvData.profile.jobRole).toBeDefined();
    expect(typeof cvData.profile.name).toBe('string');
    expect(typeof cvData.profile.jobRole).toBe('string');
  });

  test("Sidebar sections should have proper structure", async () => {
    const file = Bun.file("cv.json");
    const cvData = await file.json();

    expect(cvData.sidebar.length).toBeGreaterThan(0);

    cvData.sidebar.forEach((section, index) => {
      expect(section.title).toBeDefined();
      expect(typeof section.title).toBe('string');
      expect(section.subsections).toBeInstanceOf(Array);

      section.subsections.forEach((subsection, subIndex) => {
        expect(subsection.content).toBeDefined();
        expect(subsection.content.type).toBeDefined();
        expect(['text', 'list']).toContain(subsection.content.type);

        if (subsection.content.type === 'list') {
          expect(subsection.content.data).toBeInstanceOf(Array);
          subsection.content.data.forEach((item) => {
            expect(item.bullet).toBeDefined();
            expect(item.value).toBeDefined();
          });
        }
      });
    });
  });

  test("Main sections should have proper structure", async () => {
    const file = Bun.file("cv.json");
    const cvData = await file.json();

    expect(cvData.main.length).toBeGreaterThan(0);

    cvData.main.forEach((section) => {
      expect(section.title).toBeDefined();
      expect(typeof section.title).toBe('string');
      expect(section.subsections).toBeInstanceOf(Array);

      section.subsections.forEach((subsection) => {
        // Main sections typically have title/subtitle/period
        if (subsection.title || subsection.subtitle || subsection.period) {
          // These can be optional but if present should be strings
          if (subsection.title) expect(typeof subsection.title).toBe('string');
          if (subsection.subtitle) expect(typeof subsection.subtitle).toBe('string');
          if (subsection.period) expect(typeof subsection.period).toBe('string');
        }

        expect(subsection.content).toBeDefined();
        expect(subsection.content.type).toBeDefined();
        expect(['text', 'list']).toContain(subsection.content.type);
      });
    });
  });

  test("Contact section should use icon bullets", async () => {
    const file = Bun.file("cv.json");
    const cvData = await file.json();

    const contactSection = cvData.sidebar.find(section => section.title === 'Contact');
    expect(contactSection).toBeDefined();

    const contactSubsection = contactSection.subsections[0];
    expect(contactSubsection.content.type).toBe('list');
    expect(contactSubsection.content.data).toBeInstanceOf(Array);

    // Check for icon bullets
    const hasIconBullets = contactSubsection.content.data.some(item =>
      typeof item.bullet === 'object' && item.bullet.icon
    );
    expect(hasIconBullets).toBe(true);

    // Verify specific icons exist
    const icons = contactSubsection.content.data
      .filter(item => typeof item.bullet === 'object')
      .map(item => item.bullet.icon);

    expect(icons).toContain('phone');
    expect(icons).toContain('mail');
  });

  test("Skills section should use text bullets", async () => {
    const file = Bun.file("cv.json");
    const cvData = await file.json();

    const skillsSection = cvData.sidebar.find(section => section.title === 'Skills');
    expect(skillsSection).toBeDefined();

    const skillsSubsection = skillsSection.subsections[0];
    expect(skillsSubsection.content.type).toBe('list');
    expect(skillsSubsection.content.data).toBeInstanceOf(Array);

    // Check for text bullets
    const hasTextBullets = skillsSubsection.content.data.some(item =>
      typeof item.bullet === 'string' && item.bullet === '•'
    );
    expect(hasTextBullets).toBe(true);
  });

  test("Employment History should have complex subsection structure", async () => {
    const file = Bun.file("cv.json");
    const cvData = await file.json();

    const employmentSection = cvData.main.find(section => section.title === 'Employment History');
    expect(employmentSection).toBeDefined();
    expect(employmentSection.subsections.length).toBeGreaterThan(0);

    const firstJob = employmentSection.subsections[0];
    expect(firstJob.title).toBeDefined();
    expect(firstJob.subtitle).toBeDefined();
    expect(firstJob.period).toBeDefined();
    expect(firstJob.content.type).toBe('list');
    expect(firstJob.content.data).toBeInstanceOf(Array);
    expect(firstJob.content.data.length).toBeGreaterThan(0);
  });

  test("References section should use text content", async () => {
    const file = Bun.file("cv.json");
    const cvData = await file.json();

    const referencesSection = cvData.main.find(section => section.title === 'References');
    expect(referencesSection).toBeDefined();

    const referencesSubsection = referencesSection.subsections[0];
    expect(referencesSubsection.content.type).toBe('text');
    expect(typeof referencesSubsection.content.data).toBe('string');
  });

  test("Editor.js should contain required functions", async () => {
    const file = Bun.file("editor.js");
    const editorContent = await file.text();

    const requiredFunctions = [
      'populateAdvancedSections',
      'createAdvancedSectionElement',
      'renderSubsection',
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

    requiredFunctions.forEach(funcName => {
      expect(editorContent).toContain(funcName);
    });
  });

  test("StencilJS components should exist", async () => {
    const componentPaths = [
      "src/components/cv-generic-section/cv-generic-section.tsx",
      "src/components/cv-subsection/cv-subsection.tsx",
      "src/components/cv-list-item-generic/cv-list-item-generic.tsx"
    ];

    for (const path of componentPaths) {
      const file = Bun.file(path);
      const exists = await file.exists();
      expect(exists).toBe(true);

      if (exists) {
        const content = await file.text();
        expect(content).toContain('@Component');
      }
    }
  });

  test("Generic section component should handle subsections", async () => {
    const file = Bun.file("src/components/cv-generic-section/cv-generic-section.tsx");
    const content = await file.text();

    expect(content).toContain('subsections: Array<Subsection>');
    expect(content).toContain('cv-subsection');
    expect(content).toContain('JSON.stringify(subsection.content)');
  });

  test("Subsection component should handle content types", async () => {
    const file = Bun.file("src/components/cv-subsection/cv-subsection.tsx");
    const content = await file.text();

    expect(content).toContain('type: "text" | "list"');
    expect(content).toContain('parseContent()');
    expect(content).toContain('renderContent');
    expect(content).toContain('cv-list-item-generic');
  });

  test("List item component should handle bullets", async () => {
    const file = Bun.file("src/components/cv-list-item-generic/cv-list-item-generic.tsx");
    const content = await file.text();

    expect(content).toContain('bullet: string');
    expect(content).toContain('parseBullet()');
    expect(content).toContain('cv-icon');
    expect(content).toContain('bulletData.icon');
  });

  test("Styling configuration should be complete", async () => {
    const file = Bun.file("cv.json");
    const cvData = await file.json();

    expect(cvData.styling).toBeDefined();
    expect(cvData.styling.colors).toBeDefined();
    expect(cvData.styling.typography).toBeDefined();
    expect(cvData.styling.components).toBeDefined();

    // Check for key styling properties
    expect(cvData.styling.colors.primary).toBeDefined();
    expect(cvData.styling.colors.accent).toBeDefined();
    expect(cvData.styling.typography.fontFamily).toBeDefined();
    expect(cvData.styling.components.icon).toBeDefined();
  });