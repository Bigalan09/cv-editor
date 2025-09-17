// CV Editor Application
class CVEditor {
  constructor() {
    this.cvData = window.cvData;
    this.originalData = JSON.parse(JSON.stringify(this.cvData));
    this.currentTab = 'json';
    this.autoSaveInterval = null;
    this.jsonEditor = null;
    this.isDirty = false;

    this.init();
  }

  async init() {
    try {
      // Initialize Monaco Editor
      await this.initMonacoEditor();

      // Initialize Form Editor
      this.initFormEditor();

      // Initialize Event Listeners
      this.initEventListeners();

      // Start auto-save
      this.startAutoSave();

      // Initial sync
      this.syncPreview();

      console.log('CV Editor initialized successfully');
    } catch (error) {
      console.error('Failed to initialize CV Editor:', error);
      this.showToast('Failed to initialize editor', 'error');
    }
  }

  async initMonacoEditor() {
    return new Promise((resolve, reject) => {
      require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });

      require(['vs/editor/editor.main'], () => {
        try {
          this.jsonEditor = monaco.editor.create(document.getElementById('json-editor'), {
            value: JSON.stringify(this.cvData, null, 2),
            language: 'json',
            theme: 'vs',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            scrollBeyondLastLine: false
          });

          // Listen for changes
          this.jsonEditor.onDidChangeModelContent(() => {
            this.onJsonChange();
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  initFormEditor() {
    this.populateFormFromData();
    this.attachFormListeners();
  }

  populateFormFromData() {
    // Populate profile fields
    document.getElementById('profile-name').value = this.cvData.profile?.name || '';
    document.getElementById('profile-job-role').value = this.cvData.profile?.jobRole || '';
    document.getElementById('profile-summary').value = this.cvData.profile?.summary || '';
    document.getElementById('profile-image').value = this.cvData.profile?.image || '';

    // Update character counts
    this.updateCharCount('profile-name', 100);
    this.updateCharCount('profile-job-role', 150);
    this.updateCharCount('profile-summary', 500);

    // Populate sections with enhanced support
    this.populateAdvancedSections('sidebar', this.cvData.sidebar || []);
    this.populateAdvancedSections('main', this.cvData.main || []);
  }

  populateSections(target, sections) {
    const container = document.getElementById(`${target}-sections`);
    container.innerHTML = '';

    sections.forEach((section, index) => {
      const sectionElement = this.createSectionElement(target, section, index);
      container.appendChild(sectionElement);
    });
  }

  createSectionElement(target, section, index) {
    const div = document.createElement('div');
    div.className = 'section-item';
    div.dataset.target = target;
    div.dataset.index = index;
    div.draggable = true;

    div.innerHTML = `
      <div class="section-item-header">
        <span class="drag-handle">⋮⋮</span>
        <span class="section-item-title">${section.title || 'Untitled Section'}</span>
        <div class="section-item-controls">
          <button class="btn btn-sm btn-secondary" onclick="cvEditor.editSection('${target}', ${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="cvEditor.removeSection('${target}', ${index})">Remove</button>
        </div>
      </div>
      <div class="form-group">
        <label>Section Title</label>
        <input type="text" class="form-input section-title" value="${section.title || ''}"
               onchange="cvEditor.updateSectionTitle('${target}', ${index}, this.value)">
      </div>
    `;

    // Add drag and drop listeners
    div.addEventListener('dragstart', (e) => this.onDragStart(e));
    div.addEventListener('dragover', (e) => this.onDragOver(e));
    div.addEventListener('drop', (e) => this.onDrop(e));

    return div;
  }

  attachFormListeners() {
    // Profile field listeners
    ['profile-name', 'profile-job-role', 'profile-summary', 'profile-image'].forEach(id => {
      const element = document.getElementById(id);
      element.addEventListener('input', () => this.onFormChange());
      element.addEventListener('blur', () => this.triggerAutoSave());

      // Character count for text inputs
      if (id !== 'profile-image') {
        const maxLength = element.getAttribute('maxlength');
        if (maxLength) {
          element.addEventListener('input', () => this.updateCharCount(id, parseInt(maxLength)));
        }
      }
    });

    // Add section buttons
    document.querySelectorAll('.add-section').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target.dataset.target;
        this.addSection(target);
      });
    });
  }

  updateCharCount(fieldId, maxLength) {
    const field = document.getElementById(fieldId);
    const charCountElement = field.parentElement.querySelector('.char-count');
    const currentLength = field.value.length;

    charCountElement.textContent = `${currentLength}/${maxLength}`;

    // Update styling based on length
    charCountElement.classList.remove('warning', 'error');
    if (currentLength > maxLength * 0.9) {
      charCountElement.classList.add('warning');
    }
    if (currentLength >= maxLength) {
      charCountElement.classList.add('error');
    }
  }

  initEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Toolbar buttons
    document.getElementById('manual-save-btn').addEventListener('click', () => this.manualSave());
    document.getElementById('create-backup-btn').addEventListener('click', () => this.createBackup());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.manualSave();
      }
    });

    // Window beforeunload
    window.addEventListener('beforeunload', (e) => {
      if (this.isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content visibility
    document.querySelectorAll('.editor-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-editor-container`).classList.add('active');

    this.currentTab = tabName;

    // Sync data when switching tabs
    if (tabName === 'form') {
      this.syncJsonToForm();
    } else if (tabName === 'json') {
      this.syncFormToJson();
    }
  }

  onJsonChange() {
    try {
      const jsonText = this.jsonEditor.getValue();
      const parsedData = JSON.parse(jsonText);

      this.cvData = parsedData;
      this.isDirty = true;
      this.updateSaveStatus('Modified');

      // Sync to form if form tab is not active
      if (this.currentTab !== 'form') {
        this.syncPreview();
      }
    } catch (error) {
      // JSON is invalid, show error but don't update data
      console.warn('Invalid JSON:', error.message);
    }
  }

  onFormChange() {
    this.syncFormToJson();
    this.isDirty = true;
    this.updateSaveStatus('Modified');
    this.syncPreview();
  }

  syncFormToJson() {
    // Update cvData from form fields
    this.cvData.profile = {
      name: document.getElementById('profile-name').value,
      jobRole: document.getElementById('profile-job-role').value,
      summary: document.getElementById('profile-summary').value,
      image: document.getElementById('profile-image').value
    };

    // Update JSON editor if not in form tab
    if (this.currentTab !== 'json' && this.jsonEditor) {
      this.jsonEditor.setValue(JSON.stringify(this.cvData, null, 2));
    }
  }

  syncJsonToForm() {
    try {
      const jsonText = this.jsonEditor.getValue();
      const parsedData = JSON.parse(jsonText);

      this.cvData = parsedData;
      this.populateFormFromData();
    } catch (error) {
      this.showToast('Invalid JSON - cannot sync to form', 'error');
    }
  }

  syncPreview() {
    try {
      // Update preview components
      const profileImage = document.getElementById('preview-profile-image');
      if (profileImage && this.cvData.profile?.image) {
        profileImage.setAttribute('src', this.cvData.profile.image);
      }

      const headerComponent = document.getElementById('preview-header-component');
      if (headerComponent && this.cvData.profile) {
        headerComponent.setAttribute('name', this.cvData.profile.name || '');
        headerComponent.setAttribute('job-role', this.cvData.profile.jobRole || '');
        headerComponent.textContent = this.cvData.profile.summary || '';
      }

      // Update sidebar content
      this.updatePreviewSections('sidebar', this.cvData.sidebar || []);

      // Update main content
      this.updatePreviewSections('main', this.cvData.main || []);

    } catch (error) {
      console.error('Failed to sync preview:', error);
    }
  }

  updatePreviewSections(target, sections) {
    const container = document.getElementById(`preview-${target}-content`);
    if (!container) return;

    container.innerHTML = '';
    sections.forEach(section => {
      const sectionElement = document.createElement('cv-generic-section');
      sectionElement.setAttribute('section-title', section.title || '');
      sectionElement.setAttribute('subsections', JSON.stringify(section.subsections || []));
      container.appendChild(sectionElement);
    });
  }

  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      if (this.isDirty) {
        this.autoSave();
      }
    }, 5000); // Auto-save every 5 seconds
  }

  async autoSave() {
    try {
      const response = await fetch('/api/cv/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: this.cvData,
          createBackup: false
        })
      });

      const result = await response.json();

      if (result.success) {
        this.isDirty = false;
        this.updateSaveStatus('Auto-saved');
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      this.updateSaveStatus('Auto-save failed', 'error');
    }
  }

  async manualSave() {
    try {
      this.updateSaveStatus('Saving...', 'saving');

      const response = await fetch('/api/cv/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: this.cvData,
          createBackup: true
        })
      });

      const result = await response.json();

      if (result.success) {
        this.isDirty = false;
        this.updateSaveStatus('Saved', 'saved');
        this.showToast('CV saved successfully' + (result.backupCreated ? ' (backup created)' : ''), 'success');
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Manual save failed:', error);
      this.updateSaveStatus('Save failed', 'error');
      this.showToast('Failed to save CV: ' + error.message, 'error');
    }
  }

  async createBackup() {
    try {
      const response = await fetch('/api/cv/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: this.cvData,
          createBackup: true
        })
      });

      const result = await response.json();

      if (result.success && result.backupCreated) {
        this.showToast(`Backup created: ${result.backupCreated}`, 'success');
      } else {
        throw new Error(result.error || 'Backup creation failed');
      }
    } catch (error) {
      console.error('Backup creation failed:', error);
      this.showToast('Failed to create backup: ' + error.message, 'error');
    }
  }

  triggerAutoSave() {
    // Trigger auto-save on field blur
    if (this.isDirty) {
      this.autoSave();
    }
  }

  updateSaveStatus(message, type = '') {
    const statusElement = document.getElementById('save-status');
    statusElement.textContent = message;
    statusElement.className = type ? `${type}` : '';
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    toast.innerHTML = `
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  populateAdvancedSections(target, sections) {
    const container = document.getElementById(`${target}-sections`);
    container.innerHTML = '';

    sections.forEach((section, index) => {
      const sectionElement = this.createAdvancedSectionElement(target, section, index);
      container.appendChild(sectionElement);
    });
  }

  createAdvancedSectionElement(target, section, index) {
    const div = document.createElement('div');
    div.className = 'section-item advanced-section';
    div.dataset.target = target;
    div.dataset.index = index;
    div.draggable = true;

    // Build subsections HTML
    let subsectionsHtml = '';
    if (section.subsections && section.subsections.length > 0) {
      subsectionsHtml = section.subsections.map((subsection, subIndex) => {
        return this.renderSubsection(target, index, subsection, subIndex);
      }).join('');
    }

    div.innerHTML = `
      <div class="section-item-header">
        <span class="drag-handle">⋮⋮</span>
        <span class="section-item-title">${section.title || 'Untitled Section'}</span>
        <div class="section-item-controls">
          <button class="btn btn-sm btn-secondary" onclick="cvEditor.toggleSection('${target}', ${index})">
            <span class="toggle-icon">▼</span>
          </button>
          <button class="btn btn-sm btn-danger" onclick="cvEditor.removeSection('${target}', ${index})">Remove</button>
        </div>
      </div>
      <div class="section-content" style="display: block;">
        <div class="form-group">
          <label>Section Title</label>
          <input type="text" class="form-input section-title" value="${section.title || ''}"
                 onchange="cvEditor.updateSectionTitle('${target}', ${index}, this.value)">
        </div>
        <div class="subsections-container">
          <h4>Subsections</h4>
          <div class="subsections-list" id="${target}-${index}-subsections">
            ${subsectionsHtml}
          </div>
          <button class="btn btn-sm btn-secondary" onclick="cvEditor.addSubsection('${target}', ${index})">
            Add Subsection
          </button>
        </div>
      </div>
    `;

    // Add drag and drop listeners
    div.addEventListener('dragstart', (e) => this.onDragStart(e));
    div.addEventListener('dragover', (e) => this.onDragOver(e));
    div.addEventListener('drop', (e) => this.onDrop(e));

    return div;
  }

  renderSubsection(target, sectionIndex, subsection, subIndex) {
    const hasTitle = subsection.title || subsection.subtitle || subsection.period;
    const contentType = subsection.content?.type || 'text';

    let titleFieldsHtml = '';
    if (hasTitle || target === 'main') {
      titleFieldsHtml = `
        <div class="subsection-title-fields">
          <div class="form-group">
            <label>Title</label>
            <input type="text" class="form-input" value="${subsection.title || ''}"
                   onchange="cvEditor.updateSubsectionField('${target}', ${sectionIndex}, ${subIndex}, 'title', this.value)">
          </div>
          <div class="form-group">
            <label>Subtitle</label>
            <input type="text" class="form-input" value="${subsection.subtitle || ''}"
                   onchange="cvEditor.updateSubsectionField('${target}', ${sectionIndex}, ${subIndex}, 'subtitle', this.value)">
          </div>
          <div class="form-group">
            <label>Period</label>
            <input type="text" class="form-input" value="${subsection.period || ''}"
                   onchange="cvEditor.updateSubsectionField('${target}', ${sectionIndex}, ${subIndex}, 'period', this.value)">
          </div>
        </div>
      `;
    }

    let contentHtml = '';
    if (contentType === 'list') {
      const listItems = subsection.content?.data || [];
      const listItemsHtml = listItems.map((item, itemIndex) => {
        const bulletValue = typeof item.bullet === 'object' ? item.bullet.icon : item.bullet;
        return `
          <div class="list-item-row">
            <input type="text" class="form-input bullet-input" value="${bulletValue || '•'}"
                   onchange="cvEditor.updateListItem('${target}', ${sectionIndex}, ${subIndex}, ${itemIndex}, 'bullet', this.value)"
                   placeholder="• or icon name">
            <textarea class="form-textarea value-input" rows="2"
                      onchange="cvEditor.updateListItem('${target}', ${sectionIndex}, ${subIndex}, ${itemIndex}, 'value', this.value)"
                      placeholder="List item content">${item.value || ''}</textarea>
            <button class="btn btn-sm btn-danger" onclick="cvEditor.removeListItem('${target}', ${sectionIndex}, ${subIndex}, ${itemIndex})">×</button>
          </div>
        `;
      }).join('');

      contentHtml = `
        <div class="content-section">
          <div class="form-group">
            <label>Content Type</label>
            <select class="form-input" onchange="cvEditor.changeContentType('${target}', ${sectionIndex}, ${subIndex}, this.value)">
              <option value="list" ${contentType === 'list' ? 'selected' : ''}>List</option>
              <option value="text" ${contentType === 'text' ? 'selected' : ''}>Text</option>
            </select>
          </div>
          <div class="list-items-container">
            <label>List Items</label>
            <div class="list-items" id="${target}-${sectionIndex}-${subIndex}-items">
              ${listItemsHtml}
            </div>
            <button class="btn btn-sm btn-secondary" onclick="cvEditor.addListItem('${target}', ${sectionIndex}, ${subIndex})">
              Add List Item
            </button>
          </div>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="content-section">
          <div class="form-group">
            <label>Content Type</label>
            <select class="form-input" onchange="cvEditor.changeContentType('${target}', ${sectionIndex}, ${subIndex}, this.value)">
              <option value="list" ${contentType === 'list' ? 'selected' : ''}>List</option>
              <option value="text" ${contentType === 'text' ? 'selected' : ''}>Text</option>
            </select>
          </div>
          <div class="form-group">
            <label>Text Content</label>
            <textarea class="form-textarea" rows="3"
                      onchange="cvEditor.updateSubsectionContent('${target}', ${sectionIndex}, ${subIndex}, this.value)"
                      placeholder="Enter text content">${subsection.content?.data || ''}</textarea>
          </div>
        </div>
      `;
    }

    return `
      <div class="subsection-item" data-subsection-index="${subIndex}">
        <div class="subsection-header">
          <span class="subsection-title">${subsection.title || subsection.subtitle || 'Subsection'}</span>
          <button class="btn btn-sm btn-danger" onclick="cvEditor.removeSubsection('${target}', ${sectionIndex}, ${subIndex})">Remove</button>
        </div>
        <div class="subsection-content">
          ${titleFieldsHtml}
          ${contentHtml}
        </div>
      </div>
    `;
  }

  // Enhanced section management methods
  toggleSection(target, index) {
    const section = document.querySelector(`[data-target="${target}"][data-index="${index}"] .section-content`);
    const icon = document.querySelector(`[data-target="${target}"][data-index="${index}"] .toggle-icon`);

    if (section.style.display === 'none') {
      section.style.display = 'block';
      icon.textContent = '▼';
    } else {
      section.style.display = 'none';
      icon.textContent = '▶';
    }
  }

  addSubsection(target, sectionIndex) {
    if (!this.cvData[target][sectionIndex].subsections) {
      this.cvData[target][sectionIndex].subsections = [];
    }

    const newSubsection = {
      title: '',
      subtitle: '',
      period: '',
      content: {
        type: 'list',
        data: []
      }
    };

    this.cvData[target][sectionIndex].subsections.push(newSubsection);
    this.populateAdvancedSections(target, this.cvData[target]);
    this.onFormChange();
  }

  removeSubsection(target, sectionIndex, subIndex) {
    if (confirm('Are you sure you want to remove this subsection?')) {
      this.cvData[target][sectionIndex].subsections.splice(subIndex, 1);
      this.populateAdvancedSections(target, this.cvData[target]);
      this.onFormChange();
    }
  }

  updateSubsectionField(target, sectionIndex, subIndex, field, value) {
    if (!this.cvData[target][sectionIndex].subsections[subIndex]) return;

    this.cvData[target][sectionIndex].subsections[subIndex][field] = value;
    this.onFormChange();
  }

  updateSubsectionContent(target, sectionIndex, subIndex, value) {
    if (!this.cvData[target][sectionIndex].subsections[subIndex]) return;

    if (!this.cvData[target][sectionIndex].subsections[subIndex].content) {
      this.cvData[target][sectionIndex].subsections[subIndex].content = { type: 'text' };
    }

    this.cvData[target][sectionIndex].subsections[subIndex].content.data = value;
    this.onFormChange();
  }

  changeContentType(target, sectionIndex, subIndex, newType) {
    if (!this.cvData[target][sectionIndex].subsections[subIndex]) return;

    const subsection = this.cvData[target][sectionIndex].subsections[subIndex];

    if (newType === 'list') {
      subsection.content = {
        type: 'list',
        data: []
      };
    } else {
      subsection.content = {
        type: 'text',
        data: ''
      };
    }

    this.populateAdvancedSections(target, this.cvData[target]);
    this.onFormChange();
  }

  addListItem(target, sectionIndex, subIndex) {
    const subsection = this.cvData[target][sectionIndex].subsections[subIndex];
    if (!subsection.content.data) {
      subsection.content.data = [];
    }

    subsection.content.data.push({
      bullet: '•',
      value: ''
    });

    this.populateAdvancedSections(target, this.cvData[target]);
    this.onFormChange();
  }

  removeListItem(target, sectionIndex, subIndex, itemIndex) {
    const subsection = this.cvData[target][sectionIndex].subsections[subIndex];
    subsection.content.data.splice(itemIndex, 1);

    this.populateAdvancedSections(target, this.cvData[target]);
    this.onFormChange();
  }

  updateListItem(target, sectionIndex, subIndex, itemIndex, field, value) {
    const item = this.cvData[target][sectionIndex].subsections[subIndex].content.data[itemIndex];

    if (field === 'bullet') {
      // Check if it's an icon name (for contact items)
      const iconNames = ['phone', 'house', 'mail', 'github', 'linkedin'];
      if (iconNames.includes(value)) {
        item.bullet = { icon: value };
      } else {
        item.bullet = value;
      }
    } else {
      item[field] = value;
    }

    this.onFormChange();
  }

  // Section management methods
  addSection(target) {
    const newSection = {
      title: 'New Section',
      subsections: []
    };

    if (!this.cvData[target]) {
      this.cvData[target] = [];
    }

    this.cvData[target].push(newSection);
    this.populateAdvancedSections(target, this.cvData[target]);
    this.onFormChange();
  }

  removeSection(target, index) {
    if (confirm('Are you sure you want to remove this section?')) {
      this.cvData[target].splice(index, 1);
      this.populateAdvancedSections(target, this.cvData[target]);
      this.onFormChange();
    }
  }

  updateSectionTitle(target, index, title) {
    if (this.cvData[target] && this.cvData[target][index]) {
      this.cvData[target][index].title = title;
      this.onFormChange();
    }
  }

  // Drag and drop methods
  onDragStart(e) {
    e.dataTransfer.setData('text/plain', '');
    e.target.classList.add('dragging');
  }

  onDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }

  onDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const draggingElement = document.querySelector('.dragging');
    if (draggingElement && draggingElement !== e.currentTarget) {
      // Implement section reordering logic here
      console.log('Reorder sections - feature to be implemented');
    }

    if (draggingElement) {
      draggingElement.classList.remove('dragging');
    }
  }
}

// Initialize the editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cvEditor = new CVEditor();
});