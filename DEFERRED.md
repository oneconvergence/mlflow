# Deferred Changes

This document lists changes from CHANGES.md that were not implemented because they are not applicable to the current codebase architecture.

## Component Architecture Changes

### 1. ExperimentListView.tsx - Project Filtering Integration
**Status**: Not Applicable
**Reason**: The current `ExperimentListView.tsx` is a functional component using modern React hooks and a different architecture (uses `useExperimentListQuery`, `ExperimentListTable`, etc.), while the patch was designed for a class component with a different structure. The project filtering functionality would require a significant architectural refactoring to integrate properly.

**Original Change**: Added project filtering with localStorage persistence, ProjectListView integration, and experiment filtering by project tags.

**Alternative**: The `ProjectListView` component has been created and is available for integration if needed in the future.

### 2. HomePage.tsx - Project Filtering
**Status**: Not Applicable
**Reason**: The current `HomePage.tsx` is a simple redirect component (`<Navigate to={Routes.experimentsObservatoryRoute} />`), while the patch expected a component that filters experiments. The filtering logic would need to be implemented in a different location (likely in the experiments observatory route or a parent component).

**Original Change**: Added project filtering to `getFirstActiveExperiment` function to filter experiments by project before selecting the first active one.

### 3. RunViewMetricChart.tsx
**Status**: Not Applicable
**Reason**: This file does not exist in the current codebase. The functionality may have been refactored into other components or removed.

**Original Change**: Added `maxResults` and `showPoint` props to `RunViewMetricChart` component.

**Note**: The related functionality has been implemented in `RunViewMetricCharts.tsx` instead.

### 4. Component IDs for Testing/Accessibility
**Status**: Partially Deferred
**Files Not Found**:
- `CollapsibleTagsCell.tsx` - Component does not exist
- `SearchTree.tsx` - Component does not exist
- `StyledDropdown.tsx` - Component does not exist
- `PromptLabOnboarding.tsx` - Component does not exist
- `ExperimentViewRunsSortSelector.tsx` - Component does not exist (may have been refactored)
- `ExperimentViewRunsTableCollapse.tsx` - Component does not exist (may have been refactored)

**Reason**: These components are not present in the current codebase. They may have been removed, renamed, or refactored into other components.

### 5. Preview Pane Toggle Fix
**Status**: Not Applicable
**Reason**: `ExperimentViewRunsTableCollapse.tsx` does not exist in the current codebase. The preview pane toggle functionality may have been implemented differently or removed.

**Original Change**: Fixed toggle behavior to use `previewPaneVisible` instead of `runListHidden` in state update.

### 6. React Router Updates - App.tsx
**Status**: Not Applicable
**Reason**: `App.tsx` in the experiment-tracking components directory does not exist. The routing structure may have been refactored.

**Original Change**: Updated React Router imports, removed `CompatRouter` wrapper, commented out React Router v5 specific props.

### 7. TypeScript Configuration
**Status**: Not Applicable
**Reason**: The current `tsconfig.json` has an `include` array with `["./src/**/*"]`, which is a valid and necessary configuration. Removing it (as suggested in the patch) would break the TypeScript compilation.

**Original Change**: Removed `include` array (empty array).

## Summary

Most deferred changes are due to:
1. **Architectural refactoring**: Components have been converted from class to functional components
2. **Component removal/renaming**: Some components referenced in the patch no longer exist
3. **Configuration differences**: Current configuration is valid and should not be changed

All core features from CHANGES.md that are applicable have been implemented:
- ✅ PyTorch Trace Viewer
- ✅ Grafana Logs Integration
- ✅ Enhanced Metric Charts
- ✅ Metric Filtering Enhancement
- ✅ Performance & Limits
- ✅ Feature Flags
- ✅ Artifact View Styling
- ✅ Plot Layout Parsing
- ✅ Metric History Sampling
- ✅ Run View Metric Charts UI Enhancements

