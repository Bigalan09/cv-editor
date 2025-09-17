---
title: CV Editor Inline Editing Feature
owner: Development Team
stakeholders: [End Users, Developers]
status: Ready for Implementation
last_updated: 2025-09-17
target_release: v1.1.0
links:
  - repository: /Users/alan/Development/cv-editor
  - architecture: StencilJS + Bun + Handlebars
related_tickets: []
---

# CV Editor Inline Editing Feature Specification

## Overview

### Problem
The current CV Editor requires users to manually edit the `cv.json` file for content changes, creating friction for non-technical users and breaking the visual editing workflow. Users cannot see real-time changes and must switch between file editing and preview modes.

### Goals
1. Enable direct editing of CV content through a dedicated editing interface
2. Provide seamless split view of edit and preview mode
3. Auto-save functionality with backup protection for data safety
4. Maintain existing JSON-driven architecture and StencilJS component system with no changes to design or functionality
5. Ensure single-user editing workflow with immediate visual feedback
6. Desktop only

### Non-Goals
- Multi-user collaboration or concurrent editing
- Complex user authentication system
- Advanced rich text editing (WYSIWYG)
- Version control beyond simple backup
- Mobile-optimised editing interface

## Users & Permissions

**Primary User: CV Owner**
- Permissions: Full read/write access to personal CV data
- Use Cases: Content editing, styling adjustments, data management
- Technical Level: Mixed (technical and non-technical users)

**System: Single-User Local Application**
- No authentication required (local file system access)
- File-system level security through OS permissions
- Direct cv.json file manipulation with backup protection

## User Flows

### Primary Flow: Navigate to Edit Mode and Edit Content

1. **Read-Only View (Default at `/`)**
   - User views rendered CV in browser at `http://localhost:3000/`
   - "Edit CV" button visible in top-right corner
   - All content displayed as static, styled components
   - No editing capabilities available

2. **Navigate to Edit Mode**
   - User clicks "Edit CV" button
   - Browser navigates to `http://localhost:3000/edit`
   - Split-view layout loads: left panel (editing) + right panel (live preview)
   - Left panel shows editing tabs: "JSON Editor" and "Form Editor"
   - Auto-backup triggered: `cv.json` → `cv.json.backup.{timestamp}`

3. **Dual Editing Interface**
   - **JSON Editor Tab:** Monaco/CodeMirror with syntax highlighting, error detection
   - **Form Editor Tab:** Structured forms with drag-and-drop, add/remove buttons
   - Real-time sync between both editing modes
   - Live preview updates immediately on changes
   - Auto-save every 5 seconds + on field blur

4. **Content Editing Workflows**
   - **JSON Mode:** Direct JSON editing with validation and error highlighting
   - **Form Mode:** Visual editing with drag-and-drop reordering, file upload for images
   - **Switching Modes:** Real-time data sync, JSON errors disable form tab until fixed
   - Character limits and validation shown in both modes

5. **Save and Navigation**
   - Manual "Create Backup" button for explicit snapshots
   - "Return to View" button navigates back to `/` with current changes
   - Auto-save failures show warnings but continue working locally
   - All changes persist across mode switches and page refreshes

### Error Flow: Save Failure Recovery

1. **JSON Editing Errors**
   - Syntax errors → red underlines, error panel with line numbers
   - Schema validation errors → specific field error messages
   - JSON errors disable Form Editor tab until resolved
   - Auto-save paused until valid JSON restored

2. **Form Editing Errors**
   - Required fields empty → highlight fields, show "Required field" message
   - Character limits exceeded → show "X/Y characters" warning
   - Invalid formats → specific field validation messages
   - Form remains functional, errors shown inline

3. **Auto-Save Errors**
   - File write permission error → warning banner, local storage backup
   - Network connectivity issues → offline mode with retry queue
   - Auto-save failures don't block editing, warning displayed
   - Manual backup creation remains available

4. **Mode Switching Errors**
   - JSON syntax errors prevent switching to Form mode
   - Clear error indication with "Fix JSON to enable Form Editor"
   - Form to JSON conversion always succeeds (controlled environment)

## Functional Requirements

### FR1: Two-URL Navigation Architecture
- **Read-only view** at `/` with "Edit CV" button for navigation
- **Edit mode** at `/edit` with split-view layout and "Return to View" button
- Browser navigation preserves current editing state
- Deep linking support for both URLs

### FR2: Split-View Layout
- **Left Panel:** Editing interface with tabbed JSON/Form editors (50% width)
- **Right Panel:** Live preview of CV rendering (50% width)
- **Responsive Breakpoint:** Stack vertically on screens < 1024px width
- **Panel Resize:** Optional drag handle for custom width adjustment

### FR3: Dual Editing Modes
- **JSON Editor:** Monaco/CodeMirror with syntax highlighting and error detection
- **Form Editor:** Structured forms with visual controls and drag-and-drop
- **Tab Interface:** Clear mode switching at top of left panel
- **Real-time Sync:** Changes in either mode immediately reflect in both

### FR4: Auto-Save System
- **Automatic Saving:** Every 5 seconds + on field blur events
- **Manual Backup:** "Create Backup" button for explicit snapshots
- **Backup Management:** Retain last 5 backups, auto-clean older files
- **Local Storage:** Backup current state in browser storage for crash recovery

### FR5: JSON Editor Features
- **Syntax Highlighting:** JSON syntax with schema-aware highlighting
- **Error Detection:** Real-time syntax and schema validation
- **Line Numbers:** Clear error location identification
- **Auto-completion:** Schema-based suggestions for properties

### FR6: Form Editor Features
- **Drag & Drop:** Reorder sections and items with visual feedback
- **Add/Remove Controls:** Dynamic content management with clear buttons
- **File Upload:** Profile image upload with preview
- **Rich Text:** Basic formatting for multi-line content (bold, italic, lists)
- **Color Picker:** Styling customisation for theme colors

### FR7: Live Preview Integration
- **Real-time Updates:** Preview refreshes immediately on data changes
- **Component Rendering:** Uses existing StencilJS components unchanged
- **Styling Application:** Full styling.json integration maintained
- **Error State:** Shows validation errors in preview context

### FR8: Data Validation & Error Handling
- **JSON Schema Validation:** Real-time validation against CV data structure
- **Form Field Validation:** Required fields, character limits, format validation
- **Error Display:** Inline errors in forms, error panel for JSON
- **Mode Restrictions:** JSON errors prevent Form tab access until resolved

## API & Interface Contracts

### REST API Endpoints

#### GET `/api/cv/data`
**Purpose:** Retrieve current CV data for editing
```typescript
Response: {
  success: boolean;
  data?: CVData;
  error?: string;
}

interface CVData {
  profile: { name: string; jobTitle: string; summary: string; image?: string };
  contact: ContactItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  interests: string[];
  styling: StylingConfig;
}
```

#### POST `/api/cv/auto-save`
**Purpose:** Auto-save current editing state (non-blocking)
```typescript
Request: {
  data: CVData;
  timestamp: string;
}

Response: {
  success: boolean;
  error?: string;
}
```

#### POST `/api/cv/backup`
**Purpose:** Create manual backup snapshot
```typescript
Request: {
  data: CVData;
}

Response: {
  success: boolean;
  backupFilename?: string;
  error?: string;
}
```

#### GET `/api/cv/backups`
**Purpose:** List available backup files
```typescript
Response: {
  success: boolean;
  backups?: Array<{
    filename: string;
    timestamp: string;
    size: number;
  }>;
}
```

#### POST `/api/cv/validate`
**Purpose:** Validate CV data structure without saving
```typescript
Request: {
  data: CVData;
}

Response: {
  success: boolean;
  validationErrors?: Record<string, string>;
  schemaErrors?: Array<{
    path: string;
    message: string;
  }>;
}
```

### Split-View Layout Interface

#### Route Components
```typescript
// Main route components for two-URL architecture
interface ReadOnlyViewProps {
  cvData: CVData;
  onEditClick: () => void; // Navigate to /edit
}

interface EditViewProps {
  cvData: CVData;
  onReturnToView: () => void; // Navigate to /
}
```

#### Split-View Layout Component
```typescript
interface SplitViewLayoutProps {
  leftPanel: React.ReactNode; // Editing interface
  rightPanel: React.ReactNode; // Live preview
  onPanelResize?: (leftWidth: number) => void;
}
```

#### Editing Interface Components
```typescript
interface EditingTabsProps {
  activeTab: 'json' | 'form';
  onTabChange: (tab: 'json' | 'form') => void;
  jsonTabDisabled?: boolean; // When form has validation errors
  formTabDisabled?: boolean; // When JSON has syntax errors
}

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (errors: ValidationError[]) => void;
  schema: JSONSchema;
}

interface FormEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
  onValidationChange: (errors: Record<string, string>) => void;
}
```

#### Auto-Save State Management
```typescript
interface AutoSaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  saveError: string | null;
  retryQueue: SaveOperation[];
}

interface SaveOperation {
  data: CVData;
  timestamp: Date;
  retryCount: number;
}
```

## Data Model

### Core Data Structure (Existing cv.json)
```typescript
interface CVData {
  profile: ProfileSection;
  contact: ContactItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  interests: string[];
  styling: StylingConfig; // Read-only in edit mode
}
```

### Split-View Edit State Management
```typescript
interface EditState {
  currentView: 'read-only' | 'edit'; // URL-based state
  activeEditingMode: 'json' | 'form';
  originalData: CVData;
  currentData: CVData;
  jsonString: string; // Raw JSON representation
  isDirty: boolean;
  validationErrors: {
    json: ValidationError[];
    form: Record<string, string>;
  };
  autoSave: AutoSaveState;
  ui: {
    leftPanelWidth: number;
    jsonEditorCollapsed: boolean;
    formEditorCollapsed: boolean;
  };
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}
```

### Backup Data Model
```typescript
interface BackupFile {
  filename: string; // cv.json.backup.{timestamp}
  timestamp: Date;
  size: number;
  path: string;
}
```

**Data Lifecycle:**
1. **Load:** cv.json → EditState (both JSON string and parsed object)
2. **Navigate:** Read-only view (/) ↔ Edit view (/edit) with state preservation
3. **Edit:** JSON Editor ↔ Form Editor with real-time sync
4. **Auto-Save:** Background saves every 3 seconds + field blur events
5. **Validate:** Real-time JSON schema validation and form field validation
6. **Backup:** Manual snapshots → cv.json.backup.{timestamp}
7. **Persist:** Auto-save → cv.json, Manual backup → separate backup file
8. **Cleanup:** Retain last 5 backups, remove older files

**PII Considerations:**
- All data remains local (no external transmission)
- Backup files inherit same gitignore protection as cv.json
- No sensitive data logging in console or server logs

## Non-Functional Requirements

### Performance Requirements
- **Page Navigation:** `/` ↔ `/edit` transition < 300ms
- **Split-View Rendering:** Initial layout render < 500ms
- **Auto-Save Operations:** < 1 second for typical CV size (< 50KB)
- **Mode Switching:** JSON ↔ Form editor transition < 200ms
- **Live Preview Updates:** < 100ms after data changes
- **JSON Validation:** < 50ms for syntax and schema validation
- **Form Validation:** < 30ms per field validation

### Security Requirements
- **File Access:** Restrict write access to cv.json and backup directory only
- **Input Sanitisation:** HTML encoding for all user inputs to prevent XSS
- **Validation:** Server-side validation mirrors client-side rules
- **Error Handling:** No sensitive file paths or system info in error messages

### Accessibility Requirements
- **Keyboard Navigation:** Full keyboard access for both JSON and Form editors
- **Screen Reader Support:** ARIA labels for split-view layout and editing modes
- **Focus Management:** Logical tab order across panels and editor modes
- **High Contrast:** Visual indicators work with high contrast modes

### Localisation Requirements
- **Language:** British English for all interface text and error messages
- **Date Formats:** DD/MM/YYYY format for backup timestamps
- **Number Formats:** UK phone number validation patterns

### Observability Requirements
- **Logging:** Auto-save operations, backup creation, navigation events
- **Metrics:** Edit mode usage, JSON ↔ Form mode switching frequency
- **Error Tracking:** JSON validation errors, auto-save failures, network issues
- **Performance:** Split-view render times, editor mode switch performance
- **User Behaviour:** Time spent in each editing mode, error recovery patterns

## Acceptance Criteria

### AC1: Two-URL Navigation
```gherkin
Given I am viewing the CV at "/"
When I click the "Edit CV" button
Then the browser navigates to "/edit"
And a split-view layout appears with editing panel and live preview
And a backup file is created automatically

Given I am editing at "/edit"
When I click the "Return to View" button
Then the browser navigates to "/"
And the CV displays in read-only mode with my current changes
```

### AC2: Split-View Layout
```gherkin
Given I am at "/edit"
When the page loads
Then I see a left panel with editing tabs (JSON Editor | Form Editor)
And I see a right panel with live CV preview
And the panels are approximately 50% width each
And the layout is responsive on smaller screens
```

### AC3: Dual Editing Modes
```gherkin
Given I am in the JSON Editor tab
When I modify the JSON content
Then the Form Editor tab automatically syncs with my changes
And the live preview updates immediately
And syntax errors are highlighted with line numbers

Given I am in the Form Editor tab
When I drag to reorder a section
Then the JSON Editor content updates to reflect the new order
And the live preview shows the reordered sections
And the change is auto-saved within 5 seconds
```

### AC4: Real-Time Synchronisation
```gherkin
Given I have valid JSON in the JSON Editor
When I switch to the Form Editor tab
Then all my JSON changes appear in the form fields
And I can continue editing using visual controls

Given I have a JSON syntax error
When I try to switch to the Form Editor
Then the Form Editor tab is disabled
And I see a clear message "Fix JSON to enable Form Editor"
And the error location is highlighted in the JSON Editor
```

### AC5: Auto-Save with Error Handling
```gherkin
Given I am editing CV content
When 3 seconds pass without further changes
Then the content is automatically saved
And I see a brief "Auto-saved" indicator
And the save status shows the last saved time

Given auto-save fails due to network issues
When the error occurs
Then I see a warning banner "Auto-save failed - working offline"
And my changes remain in the editor
And auto-save retries automatically when connectivity returns
```

### AC6: Backup Management
```gherkin
Given I am at "/edit"
When I click "Create Backup"
Then a timestamped backup file is created
And I see confirmation "Backup created: cv.json.backup.{timestamp}"
And the backup appears in the backup list

Given I have created multiple backups over time
When the system has more than 5 backups
Then only the most recent 5 backups are retained
And older backup files are automatically deleted
```

## Edge Cases & Risks

### Edge Cases
1. **Large CV Data (>100KB):** Performance optimisation for JSON editor rendering
2. **Browser Refresh at `/edit`:** Persist draft state in localStorage, restore on reload
3. **Direct URL Access to `/edit`:** Load edit mode directly with proper initialisation
4. **JSON Editor Memory Usage:** Efficient virtual scrolling for large JSON files
5. **Form-to-JSON Conversion Edge Cases:** Handle undefined values, array ordering
6. **Rapid Mode Switching:** Debounce validation to prevent performance issues
7. **Network Interruption During Auto-Save:** Offline queue with retry mechanism
8. **Simultaneous Edit Sessions:** Warn if cv.json modified externally

### Risk Mitigation
- **Data Loss:** Auto-save + manual backups + localStorage persistence
- **Mode Switching Errors:** Real-time validation with clear error states
- **Performance Issues:** Virtual scrolling, debounced validation, lazy loading
- **User Confusion:** Clear visual indicators for editing modes and save states
- **Network Failures:** Offline mode with auto-retry and user notifications
- **State Inconsistency:** Atomic operations and validated state transitions

## Rollout & Migration

### Migration Requirements
- **Backward Compatibility:** Existing cv.json format unchanged
- **Component Updates:** Non-breaking prop additions to existing components
- **Server Changes:** New API routes without affecting existing functionality

### Rollout Strategy
1. **Phase 1:** Two-URL navigation and basic split-view layout
2. **Phase 2:** JSON editor with syntax highlighting and validation
3. **Phase 3:** Form editor with drag-and-drop and visual controls
4. **Phase 4:** Auto-save system and backup management
5. **Phase 5:** Performance optimisation and accessibility improvements

### Rollback Plan
- **Feature Flag:** Environment variable to disable `/edit` route entirely
- **Graceful Degradation:** "Edit CV" button hidden if editing API unavailable
- **URL Fallback:** `/edit` redirects to `/` if editing disabled
- **Data Safety:** Original cv.json format maintained throughout

## Telemetry & Alerting

### Key Metrics
- Navigation frequency: `/` → `/edit` transitions
- Editing mode usage: JSON vs Form editor time spent
- Auto-save operation success/failure rates
- JSON validation error frequency and resolution time
- Manual backup creation frequency
- Split-view layout interaction patterns

### Alerting Thresholds
- **Auto-save failure rate > 5%:** Investigate file system issues
- **JSON validation errors > 20% of sessions:** Consider UX improvements
- **Edit mode load time > 1 second:** Performance optimisation needed
- **Backup creation failures:** File permission or disk space problems

## Implementation Tasks

### Phase 1: Navigation & Layout Infrastructure (3-4 days)
1. **Two-URL Routing System**
   - Implement routing for `/` (read-only) and `/edit` (split-view)
   - Add navigation buttons: "Edit CV" and "Return to View"
   - Implement deep linking and browser history support
   - Add route-based state preservation

2. **Split-View Layout Component**
   - Create responsive split-view layout (50/50 default)
   - Implement panel resizing with drag handle
   - Add responsive stacking for mobile screens
   - Create consistent layout container

### Phase 2: JSON Editor Implementation (3-4 days)
3. **JSON Editor Integration**
   - Integrate Monaco Editor or CodeMirror with JSON syntax highlighting
   - Implement real-time JSON schema validation
   - Add error detection with line number highlighting
   - Create auto-completion for CV schema properties

4. **JSON-to-Data Synchronisation**
   - Build bidirectional JSON ↔ parsed object sync
   - Implement validation error state management
   - Add debounced parsing for performance
   - Handle malformed JSON gracefully

### Phase 3: Form Editor Implementation (4-5 days)
5. **Visual Form Interface**
   - Create structured form components for all CV sections
   - Implement drag-and-drop reordering for sections and items
   - Add add/remove buttons for dynamic content management
   - Integrate file upload for profile image

6. **Rich Form Controls**
   - Add basic rich text editing for multi-line fields
   - Implement color picker for styling customisation
   - Create validation indicators and error displays
   - Add character count displays for limited fields

### Phase 4: Auto-Save & Backup System (2-3 days)
7. **Auto-Save Implementation**
   - Create auto-save timer (3 seconds + field blur)
   - Implement `/api/cv/auto-save` endpoint with conflict detection
   - Add localStorage backup for offline/crash recovery
   - Create save status indicators and error handling

8. **Backup Management**
   - Implement manual backup creation with timestamping
   - Add backup file cleanup (retain last 5)
   - Create backup list view and restoration capability
   - Add backup creation on edit mode entry

### Phase 5: Integration & Polish (3-4 days)
9. **Mode Switching & Validation**
   - Implement real-time sync between JSON and Form modes
   - Add mode-specific error states and restrictions
   - Create smooth transitions between editing modes
   - Implement validation state coordination

10. **Testing & Accessibility**
    - End-to-end testing for all user flows
    - Accessibility testing with keyboard navigation
    - Performance testing for large CV files
    - Cross-browser compatibility testing

11. **Documentation & Deployment**
    - Update API documentation for new endpoints
    - Create user guide for dual editing modes
    - Add error handling documentation
    - Performance monitoring setup

### Total Estimated Effort: 15-20 days

## Test Plan

### Unit Tests
- JSON schema validation with malformed data edge cases
- Form-to-JSON and JSON-to-form conversion accuracy
- Auto-save timer functionality and debouncing
- API endpoint request/response handling for all endpoints
- Backup file management and cleanup operations

### Integration Tests
- Complete navigation flow: `/` ↔ `/edit` with state preservation
- Real-time synchronisation between JSON and Form editors
- Auto-save with network interruption and recovery
- Mode switching with validation error states
- Live preview updates with complex CV data changes

### User Acceptance Tests
- Complete user journey: view → edit → dual modes → save → return
- Error recovery scenarios: JSON syntax errors, network failures
- Accessibility testing: keyboard navigation, screen readers
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness and touch interaction

### Performance Tests
- Large CV data handling: 100+ entries, complex styling
- JSON editor responsiveness with large files
- Split-view layout rendering performance
- Memory usage during extended editing sessions
- Auto-save performance under high-frequency changes

---

## Open Questions
None - all implementation blockers resolved.

## Decision Log
- **Architecture:** Chosen two-URL navigation over single-page toggle for clear state separation
- **Editing Interface:** Dual JSON/Form editors with real-time sync over single editing mode
- **Layout:** Split-view with live preview over modal/overlay editing interface
- **Auto-Save Strategy:** Background saves + manual backups over manual-only save operations
- **State Management:** Context-based state with localStorage persistence
- **JSON Editor:** Monaco Editor chosen for feature completeness and TypeScript support

## Change Log
- **2025-09-17:** Initial specification created based on requirements gathering
- **2025-09-17:** Added comprehensive technical architecture and implementation tasks
- **2025-09-17:** Finalised API contracts and acceptance criteria
- **2025-09-17:** Updated to two-URL architecture with split-view editing and dual JSON/Form modes
