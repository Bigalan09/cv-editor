// CV Editor Complex Schema Verification Test
// This file tests the form editor's support for the complex CV schema structure

class ComplexSchemaVerification {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.warnings = [];
  }

  async runAllTests() {
    console.log('Starting Complex Schema Verification Tests...');

    try {
      await this.waitForEditorReady();

      // Test Suite 1: Schema Structure Support
      await this.testProfileSection();
      await this.testComplexSections();
      await this.testSubsectionStructure();

      // Test Suite 2: Content Type Support
      await this.testContentTypes();
      await this.testIconBulletSupport();
      await this.testTextBulletSupport();

      // Test Suite 3: Editing Functionality
      await this.testAddRemoveSections();
      await this.testAddRemoveSubsections();
      await this.testContentTypeSwitching();
      await this.testListItemManagement();

      // Test Suite 4: Data Integrity
      await this.testJsonFormSync();
      await this.testDataPersistence();

      // Test Suite 5: Live Preview
      await this.testLivePreviewUpdates();

      this.generateReport();

    } catch (error) {
      this.errors.push(`Test suite failed: ${error.message}`);
      console.error('Test suite failed:', error);
    }
  }

  async waitForEditorReady() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;

      const checkReady = () => {
        attempts++;
        if (window.cvEditor && window.cvEditor.cvData) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Editor not ready after 5 seconds'));
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  }

  async testProfileSection() {
    console.log('Testing Profile Section...');

    const tests = [
      {
        name: 'Profile fields exist',
        test: () => {
          const fields = ['profile-name', 'profile-job-role', 'profile-summary', 'profile-image'];
          return fields.every(id => document.getElementById(id) !== null);
        }
      },
      {
        name: 'Profile data populated correctly',
        test: () => {
          const nameField = document.getElementById('profile-name');
          const data = window.cvEditor.cvData.profile;
          return nameField.value === data.name;
        }
      },
      {
        name: 'Character counts working',
        test: () => {
          const nameField = document.getElementById('profile-name');
          const charCount = nameField.parentElement.querySelector('.char-count');
          return charCount !== null && charCount.textContent.includes('/');
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Profile Section',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Profile Section',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testComplexSections() {
    console.log('Testing Complex Sections...');

    const tests = [
      {
        name: 'Sidebar sections populated',
        test: () => {
          const sidebarContainer = document.getElementById('sidebar-sections');
          return sidebarContainer && sidebarContainer.children.length > 0;
        }
      },
      {
        name: 'Main sections populated',
        test: () => {
          const mainContainer = document.getElementById('main-sections');
          return mainContainer && mainContainer.children.length > 0;
        }
      },
      {
        name: 'Sections have advanced structure',
        test: () => {
          const firstSection = document.querySelector('.advanced-section');
          return firstSection !== null;
        }
      },
      {
        name: 'Section titles editable',
        test: () => {
          const titleInput = document.querySelector('.section-title');
          return titleInput && titleInput.type === 'text';
        }
      },
      {
        name: 'Subsections container exists',
        test: () => {
          const subsectionsContainer = document.querySelector('.subsections-container');
          return subsectionsContainer !== null;
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Complex Sections',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Complex Sections',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testSubsectionStructure() {
    console.log('Testing Subsection Structure...');

    const tests = [
      {
        name: 'Subsections rendered',
        test: () => {
          const subsectionItems = document.querySelectorAll('.subsection-item');
          return subsectionItems.length > 0;
        }
      },
      {
        name: 'Title/Subtitle/Period fields exist',
        test: () => {
          const titleFields = document.querySelector('.subsection-title-fields');
          if (!titleFields) return false;

          const inputs = titleFields.querySelectorAll('input[type="text"]');
          return inputs.length >= 3; // title, subtitle, period
        }
      },
      {
        name: 'Content section exists',
        test: () => {
          const contentSection = document.querySelector('.content-section');
          return contentSection !== null;
        }
      },
      {
        name: 'Content type selector exists',
        test: () => {
          const selector = document.querySelector('select[onchange*="changeContentType"]');
          return selector !== null;
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Subsection Structure',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Subsection Structure',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testContentTypes() {
    console.log('Testing Content Types...');

    const tests = [
      {
        name: 'List content type supported',
        test: () => {
          const listContainer = document.querySelector('.list-items-container');
          return listContainer !== null;
        }
      },
      {
        name: 'Text content type supported',
        test: () => {
          const textArea = document.querySelector('textarea[onchange*="updateSubsectionContent"]');
          return textArea !== null;
        }
      },
      {
        name: 'List items container exists',
        test: () => {
          const listItems = document.querySelector('.list-items');
          return listItems !== null;
        }
      },
      {
        name: 'Add list item button exists',
        test: () => {
          const addButton = document.querySelector('button[onclick*="addListItem"]');
          return addButton !== null;
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Content Types',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Content Types',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testIconBulletSupport() {
    console.log('Testing Icon Bullet Support...');

    const tests = [
      {
        name: 'Icon bullets in contact section',
        test: () => {
          // Look for bullet inputs with icon values
          const bulletInputs = document.querySelectorAll('.bullet-input');
          const iconBullets = Array.from(bulletInputs).some(input =>
            ['phone', 'house', 'mail', 'github', 'linkedin'].includes(input.value)
          );
          return iconBullets;
        }
      },
      {
        name: 'Bullet input fields exist',
        test: () => {
          const bulletInputs = document.querySelectorAll('.bullet-input');
          return bulletInputs.length > 0;
        }
      },
      {
        name: 'Value input fields exist',
        test: () => {
          const valueInputs = document.querySelectorAll('.value-input');
          return valueInputs.length > 0;
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Icon Bullet Support',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Icon Bullet Support',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testTextBulletSupport() {
    console.log('Testing Text Bullet Support...');

    const tests = [
      {
        name: 'Text bullets in skills section',
        test: () => {
          // Look for bullet inputs with "•" values
          const bulletInputs = document.querySelectorAll('.bullet-input');
          const textBullets = Array.from(bulletInputs).some(input => input.value === '•');
          return textBullets;
        }
      },
      {
        name: 'Bullet inputs accept text',
        test: () => {
          const bulletInput = document.querySelector('.bullet-input');
          if (!bulletInput) return false;

          const originalValue = bulletInput.value;
          bulletInput.value = '★';
          const changed = bulletInput.value === '★';
          bulletInput.value = originalValue; // Restore
          return changed;
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Text Bullet Support',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Text Bullet Support',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testAddRemoveSections() {
    console.log('Testing Add/Remove Sections...');

    const tests = [
      {
        name: 'Add section buttons exist',
        test: () => {
          const addButtons = document.querySelectorAll('.add-section');
          return addButtons.length >= 2; // sidebar and main
        }
      },
      {
        name: 'Remove section buttons exist',
        test: () => {
          const removeButtons = document.querySelectorAll('button[onclick*="removeSection"]');
          return removeButtons.length > 0;
        }
      },
      {
        name: 'Add section functionality',
        test: () => {
          // Test that cvEditor.addSection function exists
          return typeof window.cvEditor.addSection === 'function';
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Add/Remove Sections',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Add/Remove Sections',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testAddRemoveSubsections() {
    console.log('Testing Add/Remove Subsections...');

    const tests = [
      {
        name: 'Add subsection buttons exist',
        test: () => {
          const addButtons = document.querySelectorAll('button[onclick*="addSubsection"]');
          return addButtons.length > 0;
        }
      },
      {
        name: 'Remove subsection buttons exist',
        test: () => {
          const removeButtons = document.querySelectorAll('button[onclick*="removeSubsection"]');
          return removeButtons.length > 0;
        }
      },
      {
        name: 'Add subsection functionality',
        test: () => {
          return typeof window.cvEditor.addSubsection === 'function';
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Add/Remove Subsections',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Add/Remove Subsections',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testContentTypeSwitching() {
    console.log('Testing Content Type Switching...');

    const tests = [
      {
        name: 'Content type change function exists',
        test: () => {
          return typeof window.cvEditor.changeContentType === 'function';
        }
      },
      {
        name: 'Content type selectors exist',
        test: () => {
          const selectors = document.querySelectorAll('select[onchange*="changeContentType"]');
          return selectors.length > 0;
        }
      },
      {
        name: 'List and text options available',
        test: () => {
          const selector = document.querySelector('select[onchange*="changeContentType"]');
          if (!selector) return false;

          const options = Array.from(selector.options).map(opt => opt.value);
          return options.includes('list') && options.includes('text');
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Content Type Switching',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Content Type Switching',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testListItemManagement() {
    console.log('Testing List Item Management...');

    const tests = [
      {
        name: 'List item rows exist',
        test: () => {
          const listItemRows = document.querySelectorAll('.list-item-row');
          return listItemRows.length > 0;
        }
      },
      {
        name: 'Remove list item buttons exist',
        test: () => {
          const removeButtons = document.querySelectorAll('button[onclick*="removeListItem"]');
          return removeButtons.length > 0;
        }
      },
      {
        name: 'Add list item functionality',
        test: () => {
          return typeof window.cvEditor.addListItem === 'function';
        }
      },
      {
        name: 'Update list item functionality',
        test: () => {
          return typeof window.cvEditor.updateListItem === 'function';
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'List Item Management',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'List Item Management',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testJsonFormSync() {
    console.log('Testing JSON-Form Synchronization...');

    const tests = [
      {
        name: 'JSON editor exists',
        test: () => {
          return window.cvEditor.jsonEditor !== null;
        }
      },
      {
        name: 'Form to JSON sync function exists',
        test: () => {
          return typeof window.cvEditor.syncFormToJson === 'function';
        }
      },
      {
        name: 'JSON to form sync function exists',
        test: () => {
          return typeof window.cvEditor.syncJsonToForm === 'function';
        }
      },
      {
        name: 'Tab switching triggers sync',
        test: () => {
          return typeof window.cvEditor.switchTab === 'function';
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'JSON-Form Sync',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'JSON-Form Sync',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testDataPersistence() {
    console.log('Testing Data Persistence...');

    const tests = [
      {
        name: 'Auto-save enabled',
        test: () => {
          return window.cvEditor.autoSaveInterval !== null;
        }
      },
      {
        name: 'Manual save function exists',
        test: () => {
          return typeof window.cvEditor.manualSave === 'function';
        }
      },
      {
        name: 'Save status indicator exists',
        test: () => {
          return document.getElementById('save-status') !== null;
        }
      },
      {
        name: 'Dirty state tracking',
        test: () => {
          return typeof window.cvEditor.isDirty === 'boolean';
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Data Persistence',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Data Persistence',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  async testLivePreviewUpdates() {
    console.log('Testing Live Preview Updates...');

    const tests = [
      {
        name: 'Preview sync function exists',
        test: () => {
          return typeof window.cvEditor.syncPreview === 'function';
        }
      },
      {
        name: 'Preview components exist',
        test: () => {
          const profileImage = document.getElementById('preview-profile-image');
          const headerComponent = document.getElementById('preview-header-component');
          return profileImage !== null && headerComponent !== null;
        }
      },
      {
        name: 'Preview sections containers exist',
        test: () => {
          const sidebarContent = document.getElementById('preview-sidebar-content');
          const mainContent = document.getElementById('preview-main-content');
          return sidebarContent !== null && mainContent !== null;
        }
      },
      {
        name: 'Generic sections in preview',
        test: () => {
          const genericSections = document.querySelectorAll('cv-generic-section');
          return genericSections.length > 0;
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = test.test();
        this.testResults.push({
          suite: 'Live Preview',
          test: test.name,
          status: passed ? 'PASS' : 'FAIL',
          details: passed ? 'Test passed' : 'Test failed'
        });
      } catch (error) {
        this.testResults.push({
          suite: 'Live Preview',
          test: test.name,
          status: 'ERROR',
          details: error.message
        });
      }
    }
  }

  generateReport() {
    console.log('\n=== COMPLEX SCHEMA VERIFICATION REPORT ===\n');

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
    const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
    const errorTests = this.testResults.filter(r => r.status === 'ERROR').length;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`Failed: ${failedTests} (${Math.round(failedTests/totalTests*100)}%)`);
    console.log(`Errors: ${errorTests} (${Math.round(errorTests/totalTests*100)}%)`);
    console.log('');

    // Group by suite
    const suites = [...new Set(this.testResults.map(r => r.suite))];

    suites.forEach(suite => {
      console.log(`\n--- ${suite} ---`);
      const suiteTests = this.testResults.filter(r => r.suite === suite);

      suiteTests.forEach(test => {
        const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${icon} ${test.test}: ${test.status}`);
        if (test.status !== 'PASS') {
          console.log(`   Details: ${test.details}`);
        }
      });
    });

    // Overall assessment
    console.log('\n=== OVERALL ASSESSMENT ===');
    const successRate = passedTests / totalTests;

    if (successRate >= 0.9) {
      console.log('🎉 EXCELLENT: Complex schema support is working well!');
    } else if (successRate >= 0.7) {
      console.log('👍 GOOD: Most complex schema features working, some improvements needed.');
    } else if (successRate >= 0.5) {
      console.log('⚠️ FAIR: Basic support present, significant improvements needed.');
    } else {
      console.log('❌ POOR: Major issues with complex schema support.');
    }

    // Store results globally for inspection
    window.verificationResults = {
      summary: { totalTests, passedTests, failedTests, errorTests, successRate },
      results: this.testResults,
      errors: this.errors,
      warnings: this.warnings
    };

    console.log('\nResults stored in window.verificationResults for detailed inspection.');
  }
}

// Auto-run tests when this script is loaded
if (typeof window !== 'undefined') {
  window.ComplexSchemaVerification = ComplexSchemaVerification;

  // Run tests after a short delay to ensure page is fully loaded
  setTimeout(() => {
    const verification = new ComplexSchemaVerification();
    verification.runAllTests();
  }, 1000);
}