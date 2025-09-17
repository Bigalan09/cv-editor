// Manual Browser Verification Script for CV Editor Complex Schema Support
// Load this script in the browser console on http://localhost:3000/edit

(function() {
  'use strict';

  console.log('🚀 Starting Manual CV Editor Verification...');

  class ManualVerification {
    constructor() {
      this.results = [];
      this.errors = [];
      this.warnings = [];
    }

    async runAllTests() {
      try {
        await this.waitForEditorReady();

        // Test suites
        await this.testIconBulletHandling();
        await this.testContentTypeSwitching();
        await this.testDataIntegrity();
        await this.testLivePreview();
        await this.testEditingWorkflow();

        this.displayResults();
      } catch (error) {
        console.error('❌ Manual verification failed:', error);
        this.errors.push(error.message);
        this.displayResults();
      }
    }

    async waitForEditorReady() {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50;

        const checkReady = () => {
          attempts++;
          if (window.cvEditor && window.cvEditor.cvData) {
            console.log('✅ Editor ready');
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

    async testIconBulletHandling() {
      console.log('🎯 Testing Icon Bullet Handling...');

      const tests = [
        {
          name: 'Contact section has icon bullets',
          test: () => {
            const bulletInputs = document.querySelectorAll('.bullet-input');
            const iconBullets = Array.from(bulletInputs).filter(input =>
              ['phone', 'house', 'mail', 'github', 'linkedin'].includes(input.value)
            );
            return { passed: iconBullets.length > 0, details: `Found ${iconBullets.length} icon bullets` };
          }
        },
        {
          name: 'Icon bullet input modification',
          test: () => {
            const phoneInput = Array.from(document.querySelectorAll('.bullet-input'))
              .find(input => input.value === 'phone');

            if (!phoneInput) return { passed: false, details: 'No phone bullet input found' };

            // Test changing icon
            const originalValue = phoneInput.value;
            phoneInput.value = 'mail';
            phoneInput.dispatchEvent(new Event('change'));

            // Check if data was updated
            const contactSection = window.cvEditor.cvData.sidebar.find(s => s.title === 'Contact');
            const hasMailIcon = contactSection.subsections[0].content.data.some(item =>
              typeof item.bullet === 'object' && item.bullet.icon === 'mail'
            );

            // Restore original value
            phoneInput.value = originalValue;
            phoneInput.dispatchEvent(new Event('change'));

            return { passed: hasMailIcon, details: 'Successfully changed icon bullet' };
          }
        }
      ];

      for (const test of tests) {
        try {
          const result = test.test();
          this.results.push({
            suite: 'Icon Bullet Handling',
            test: test.name,
            status: result.passed ? 'PASS' : 'FAIL',
            details: result.details
          });
        } catch (error) {
          this.results.push({
            suite: 'Icon Bullet Handling',
            test: test.name,
            status: 'ERROR',
            details: error.message
          });
        }
      }
    }

    async testContentTypeSwitching() {
      console.log('🔄 Testing Content Type Switching...');

      const tests = [
        {
          name: 'Content type selectors exist',
          test: () => {
            const selectors = document.querySelectorAll('select[onchange*="changeContentType"]');
            return { passed: selectors.length > 0, details: `Found ${selectors.length} content type selectors` };
          }
        },
        {
          name: 'Switch from list to text',
          test: () => {
            const selector = document.querySelector('select[onchange*="changeContentType"]');
            if (!selector) return { passed: false, details: 'No content type selector found' };

            const originalValue = selector.value;

            // Switch to text
            selector.value = 'text';
            selector.dispatchEvent(new Event('change'));

            // Check if text area appears
            const textArea = document.querySelector('textarea[onchange*="updateSubsectionContent"]');
            const textAreaVisible = textArea && textArea.closest('.content-section');

            // Switch back
            selector.value = originalValue;
            selector.dispatchEvent(new Event('change'));

            return { passed: !!textAreaVisible, details: 'Content type switching functional' };
          }
        }
      ];

      for (const test of tests) {
        try {
          const result = test.test();
          this.results.push({
            suite: 'Content Type Switching',
            test: test.name,
            status: result.passed ? 'PASS' : 'FAIL',
            details: result.details
          });
        } catch (error) {
          this.results.push({
            suite: 'Content Type Switching',
            test: test.name,
            status: 'ERROR',
            details: error.message
          });
        }
      }
    }

    async testDataIntegrity() {
      console.log('🔒 Testing Data Integrity...');

      const tests = [
        {
          name: 'Form to JSON sync',
          test: () => {
            const nameField = document.getElementById('profile-name');
            if (!nameField) return { passed: false, details: 'Profile name field not found' };

            const originalValue = nameField.value;
            const testValue = 'Test Name Change';

            nameField.value = testValue;
            nameField.dispatchEvent(new Event('input'));

            const dataUpdated = window.cvEditor.cvData.profile.name === testValue;

            // Restore original value
            nameField.value = originalValue;
            nameField.dispatchEvent(new Event('input'));

            return { passed: dataUpdated, details: 'Form changes sync to data correctly' };
          }
        },
        {
          name: 'Tab switching preserves data',
          test: () => {
            const originalData = JSON.stringify(window.cvEditor.cvData);

            // Switch to JSON tab and back
            window.cvEditor.switchTab('json');
            window.cvEditor.switchTab('form');

            const dataPreserved = JSON.stringify(window.cvEditor.cvData) === originalData;
            return { passed: dataPreserved, details: 'Data preserved during tab switching' };
          }
        }
      ];

      for (const test of tests) {
        try {
          const result = test.test();
          this.results.push({
            suite: 'Data Integrity',
            test: test.name,
            status: result.passed ? 'PASS' : 'FAIL',
            details: result.details
          });
        } catch (error) {
          this.results.push({
            suite: 'Data Integrity',
            test: test.name,
            status: 'ERROR',
            details: error.message
          });
        }
      }
    }

    async testLivePreview() {
      console.log('👀 Testing Live Preview...');

      const tests = [
        {
          name: 'Preview components exist',
          test: () => {
            const profileImage = document.getElementById('preview-profile-image');
            const headerComponent = document.getElementById('preview-header-component');
            const genericSections = document.querySelectorAll('cv-generic-section');

            return {
              passed: profileImage && headerComponent && genericSections.length > 0,
              details: `Found ${genericSections.length} generic sections in preview`
            };
          }
        },
        {
          name: 'Preview updates with form changes',
          test: () => {
            const nameField = document.getElementById('profile-name');
            const headerComponent = document.getElementById('preview-header-component');

            if (!nameField || !headerComponent) {
              return { passed: false, details: 'Required elements not found' };
            }

            const originalValue = nameField.value;
            const testValue = 'Preview Test Name';

            nameField.value = testValue;
            nameField.dispatchEvent(new Event('input'));

            // Trigger preview update
            window.cvEditor.syncPreview();

            const previewUpdated = headerComponent.getAttribute('name') === testValue;

            // Restore original value
            nameField.value = originalValue;
            nameField.dispatchEvent(new Event('input'));
            window.cvEditor.syncPreview();

            return { passed: previewUpdated, details: 'Preview updates correctly with form changes' };
          }
        }
      ];

      for (const test of tests) {
        try {
          const result = test.test();
          this.results.push({
            suite: 'Live Preview',
            test: test.name,
            status: result.passed ? 'PASS' : 'FAIL',
            details: result.details
          });
        } catch (error) {
          this.results.push({
            suite: 'Live Preview',
            test: test.name,
            status: 'ERROR',
            details: error.message
          });
        }
      }
    }

    async testEditingWorkflow() {
      console.log('✏️ Testing Complete Editing Workflow...');

      const tests = [
        {
          name: 'Add new subsection',
          test: () => {
            const addButton = document.querySelector('button[onclick*="addSubsection"]');
            if (!addButton) return { passed: false, details: 'Add subsection button not found' };

            const originalSubsectionCount = document.querySelectorAll('.subsection-item').length;

            // Click add subsection
            addButton.click();

            const newSubsectionCount = document.querySelectorAll('.subsection-item').length;
            return {
              passed: newSubsectionCount > originalSubsectionCount,
              details: `Subsections increased from ${originalSubsectionCount} to ${newSubsectionCount}`
            };
          }
        },
        {
          name: 'Add new list item',
          test: () => {
            const addListButton = document.querySelector('button[onclick*="addListItem"]');
            if (!addListButton) return { passed: false, details: 'Add list item button not found' };

            const originalListItemCount = document.querySelectorAll('.list-item-row').length;

            // Click add list item
            addListButton.click();

            const newListItemCount = document.querySelectorAll('.list-item-row').length;
            return {
              passed: newListItemCount > originalListItemCount,
              details: `List items increased from ${originalListItemCount} to ${newListItemCount}`
            };
          }
        },
        {
          name: 'Edit list item value',
          test: () => {
            const valueInput = document.querySelector('.value-input');
            if (!valueInput) return { passed: false, details: 'No value input found' };

            const originalValue = valueInput.value;
            const testValue = 'Test workflow value';

            valueInput.value = testValue;
            valueInput.dispatchEvent(new Event('change'));

            // Check if change was reflected in data
            const sections = [...window.cvEditor.cvData.sidebar, ...window.cvEditor.cvData.main];
            let valueFound = false;

            for (const section of sections) {
              for (const subsection of section.subsections || []) {
                if (subsection.content?.type === 'list') {
                  valueFound = subsection.content.data.some(item => item.value === testValue);
                  if (valueFound) break;
                }
              }
              if (valueFound) break;
            }

            // Restore original value
            valueInput.value = originalValue;
            valueInput.dispatchEvent(new Event('change'));

            return { passed: valueFound, details: 'List item value editing works correctly' };
          }
        }
      ];

      for (const test of tests) {
        try {
          const result = test.test();
          this.results.push({
            suite: 'Editing Workflow',
            test: test.name,
            status: result.passed ? 'PASS' : 'FAIL',
            details: result.details
          });
        } catch (error) {
          this.results.push({
            suite: 'Editing Workflow',
            test: test.name,
            status: 'ERROR',
            details: error.message
          });
        }
      }
    }

    displayResults() {
      console.log('\n=== MANUAL VERIFICATION RESULTS ===\n');

      const totalTests = this.results.length;
      const passedTests = this.results.filter(r => r.status === 'PASS').length;
      const failedTests = this.results.filter(r => r.status === 'FAIL').length;
      const errorTests = this.results.filter(r => r.status === 'ERROR').length;

      console.log(`📊 Summary:`);
      console.log(`   Total Tests: ${totalTests}`);
      console.log(`   ✅ Passed: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`);
      console.log(`   ❌ Failed: ${failedTests} (${Math.round(failedTests/totalTests*100)}%)`);
      console.log(`   ⚠️ Errors: ${errorTests} (${Math.round(errorTests/totalTests*100)}%)`);

      // Group by suite
      const suites = [...new Set(this.results.map(r => r.suite))];

      suites.forEach(suite => {
        console.log(`\n📋 ${suite}:`);
        const suiteTests = this.results.filter(r => r.suite === suite);

        suiteTests.forEach(test => {
          const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
          console.log(`   ${icon} ${test.test}: ${test.details}`);
        });
      });

      // Overall assessment
      const successRate = passedTests / totalTests;
      console.log('\n🎯 Overall Assessment:');

      if (successRate >= 0.9) {
        console.log('🎉 EXCELLENT: All complex schema features working correctly!');
      } else if (successRate >= 0.7) {
        console.log('👍 GOOD: Most complex schema features working, minor issues detected.');
      } else if (successRate >= 0.5) {
        console.log('⚠️ FAIR: Basic functionality present, improvements needed.');
      } else {
        console.log('❌ POOR: Significant issues with complex schema support.');
      }

      // Store results globally
      window.manualVerificationResults = {
        summary: { totalTests, passedTests, failedTests, errorTests, successRate },
        results: this.results,
        errors: this.errors,
        warnings: this.warnings
      };

      console.log('\n📋 Results stored in window.manualVerificationResults for inspection.');
      console.log('\n✨ Manual verification complete!');
    }
  }

  // Auto-run verification
  const verification = new ManualVerification();
  verification.runAllTests();

  // Expose for manual running
  window.runManualVerification = () => {
    const verification = new ManualVerification();
    verification.runAllTests();
  };

})();