# DKUBEX Changes Summary

## Table of Contents

### New Features
- [1. PyTorch Trace Viewer](#1-pytorch-trace-viewer)
- [2. Grafana Logs Integration](#2-grafana-logs-integration)
- [3. Project-Based Experiment Filtering](#3-project-based-experiment-filtering)
- [4. Enhanced Metric Charts](#4-enhanced-metric-charts)

### Feature Flags & Configuration
- [Disabled Features](#disabled-features)

### UI/UX Improvements
- [Component IDs for Testing/Accessibility](#component-ids-for-testingaccessibility)
- [Performance & Limits](#performance--limits)
- [Metric Filtering Enhancement](#metric-filtering-enhancement)

### Routing & Navigation
- [React Router Updates](#react-router-updates)

### File Handling
- [Trace File Support](#trace-file-support)
- [Artifact View Styling](#artifact-view-styling)

### Bug Fixes & Improvements
- [Plot Layout Parsing](#plot-layout-parsing)
- [Preview Pane Toggle](#preview-pane-toggle)
- [Experiment List State Management](#experiment-list-state-management)
- [Metric History Sampling](#metric-history-sampling)
- [Run View Metric Charts UI Enhancements](#run-view-metric-charts-ui-enhancements)

### Build & Configuration
- [NPM Configuration](#npm-configuration)
- [TypeScript Configuration](#typescript-configuration)
- [Design System Update](#design-system-update)
- [Setup Script Removal](#setup-script-removal)
- [Type Updates](#type-updates)

### Docker Image Build
- [Image Build](#image-build)
---

## New Features

### 1. PyTorch Trace Viewer
- **Files**:
  - `mlflow/server/js/public/lib/artifact-trace-viewer/trace_embedding.html` (new)
  - `mlflow/server/js/public/lib/artifact-trace-viewer/trace_viewer_full.html` (new)
  - `mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTraceView.tsx` (new)
  - `mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTraceView.css` (new)
- **Description**: Added support for viewing PyTorch trace files (`.pt.trace.json`, `.pt.trace.json.gz`) as artifacts with an embedded trace viewer interface.

### 2. Grafana Logs Integration
- **Files**:
  - `mlflow/server/js/src/experiment-tracking/components/run-page/GrafanaIframe.tsx` (new)
  - `mlflow/server/js/src/experiment-tracking/components/run-page/RunPage.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewModeSwitch.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/run-page/useRunViewActiveTab.tsx`
  - `mlflow/server/js/src/experiment-tracking/constants.ts`
- **Description**: Added a new "Logs" tab in the run page that embeds Grafana dashboards for viewing run logs. Includes tab selector integration.

### 3. Project-Based Experiment Filtering
- **Files**:
  - `mlflow/server/js/src/experiment-tracking/components/ProjectListView.tsx` (new)
  - `mlflow/server/js/src/experiment-tracking/components/ExperimentListView.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/HomePage.tsx`
- **Description**: Added project filtering functionality allowing users to filter experiments by project tags (All, Default, or specific project names). Includes localStorage persistence for selected experiments and project preferences.

### 4. Enhanced Metric Charts
- **Files**:
  - `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricChart.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsLineChartCard.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/runs-charts/components/hooks/useLineChartGlobalConfig.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/experiment-page/models/ExperimentPageUIState.tsx`
- **Description**: Added `maxResults` and `showPoint` configuration options for metric charts, allowing customizable data point limits and point display. Includes UI controls (samples dropdown and points toggle switch) with localStorage persistence for user preferences.

## Feature Flags & Configuration

### Disabled Features
- **Files**:
  - `mlflow/server/js/src/common/utils/FeatureUtils.ts`
  - `mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.fetch-utils.ts`
- **Changes**:
  - `shouldEnableDeepLearningUI()` returns `false`
  - `shouldEnableExperimentDatasetTracking()` returns `false`
  - `shouldRefetchRuns()` returns `true` (added in `experimentPage.fetch-utils.ts`)

## UI/UX Improvements

### Component IDs for Testing/Accessibility
- **Files**:
  - `mlflow/server/js/src/common/components/CollapsibleTagsCell.tsx`
  - `mlflow/server/js/src/common/components/SearchTree.tsx`
  - `mlflow/server/js/src/common/components/StyledDropdown.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/experiment-page/components/PromptLabOnboarding.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsSortSelector.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsTableCollapse.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/ExperimentListView.tsx`
- **Description**: Added `componentId` props to various UI components for improved testability and accessibility.

### Performance & Limits
- **Files**: `mlflow/server/js/src/experiment-tracking/components/MetricsPlotPanel.tsx`
- **Changes**: Increased `MAXIMUM_METRIC_DATA_POINTS` from 100,000 to 1,000,000

### Metric Filtering Enhancement
- **Files**:
  - `mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewMetricsTable.tsx`
  - `mlflow/server/js/src/experiment-tracking/utils/MetricsUtils.ts`
- **Description**: Enhanced metric filtering to support normalized metric keys (stripping system metric prefixes) for better search functionality. Added `normalizeChartMetricKey()` utility function.

## Routing & Navigation

### React Router Updates
- **Files**:
  - `mlflow/server/js/src/common/utils/RoutingUtils.tsx`
  - `mlflow/server/js/src/experiment-tracking/components/App.tsx`
- **Changes**:
  - Removed `CompatRouter` wrapper
  - Added `NavLink` export
  - Updated imports to use direct `HashRouter`, `Link`, and `NavLink` from routing utils
  - Commented out `hashType` prop (React Router v6 compatibility)
  - Changed `HomePage` import from named to default export
  - Commented out NavLink props (`strict`, `activeStyle`, `isActive`) for React Router v6 compatibility
  - Restructured route definitions (moved Routes outside CompatRouter)

## File Handling

### Trace File Support
- **Files**:
  - `mlflow/server/js/src/common/utils/FileUtils.ts`
  - `mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactPage.tsx`
- **Changes**:
  - Added `TRACE_EXTENSIONS` constant for `.pt.trace.json` and `.pt.trace.json.gz` files
  - Enhanced `getExtension()` function to properly detect trace file extensions with compression suffixes

### Artifact View Styling
- **Files**: `mlflow/server/js/src/experiment-tracking/components/ArtifactView.css`
- **Changes**: Added `height: 100%`, `width: 100%`, and `position: relative` to `.artifact-view` for proper layout.

## Bug Fixes & Improvements

### Plot Layout Parsing
- **Files**: `mlflow/server/js/src/common/utils/Utils.tsx`
- **Description**: Fixed JSON parsing of plot layout by removing whitespace before parsing to prevent parsing errors.

### Preview Pane Toggle
- **Files**: `mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsTableCollapse.tsx`
- **Changes**: Fixed toggle behavior to use `previewPaneVisible` instead of `runListHidden` in state update. Added componentId for testing.

### Experiment List State Management
- **Files**: `mlflow/server/js/src/experiment-tracking/components/ExperimentListView.tsx`
- **Changes**:
  - Added localStorage persistence for selected experiments (`selected-experiments`)
  - Changed `list` property type from `VList | undefined` to `any`
  - Added project state initialization from localStorage (`mlflow-exp-project`)
  - Updated `componentDidUpdate` to sync with localStorage changes and trigger route updates
  - Added `persistSelectedExperiemnts` method for state persistence
  - Integrated `ProjectListView` component into experiment list UI

### Metric History Sampling
- **Files**: `mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useSampledMetricHistory.tsx`
- **Changes**: Changed sampling mode from `'all'` to `'auto'` for better performance.

### Run View Metric Charts UI Enhancements
- **Files**: `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.tsx`
- **Changes**:
  - Added UI controls for samples selection (dropdown with options: 320, 500, 1000, 2500)
  - Added toggle switch for showing/hiding data points
  - Added localStorage persistence for default samples preference (`mlflow-run-chart-default-samples`)
  - Added `useEffect` hook to sync `maxSteps` and `showPoint` state with global line chart config
  - Added additional imports: `Empty`, `Input`, `SearchIcon`, `Spacer`, `DialogCombobox` components, `Switch`, `FormattedMessage`

## Build & Configuration

### NPM Configuration
- **Files**: `mlflow/server/js/.npmrc` (new)
- **Description**: Added NPM registry configuration file.

### TypeScript Configuration
- **Files**: `mlflow/server/js/tsconfig.json`
- **Changes**: Removed `include` array (empty array), likely for build optimization.

### Design System Update
- **Files**: `mlflow/server/js/yarn.lock`
- **Description**: Updated `@databricks/design-system` dependency hash.

### Setup Script Removal
- **Files**: `setup.py` (deleted)
- **Description**: Removed legacy `setup.py` file (migration to `pyproject.toml`).

### Type Updates
- **Files**:
  - `mlflow/server/js/src/experiment-tracking/types.ts`
  - `mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsTable.tsx`
- **Changes**:
  - Added `UpdateExperimentSearchFacetsFn` type export
  - Added import for `RUNS_VISIBILITY_MODE` enum

## Docker Image Build
### Image Build
1. **Clone the Git Repository**
   - Repository URL: [MLFlow GitHub Repo](https://github.com/oneconvergence/mlflow)
   - Branch: `d3x-v2.21.2`
2. **Build**
   ```bash
   sudo docker build -t <image-name>:<tag> .
   ```
---

## Running MLFLOW Locally

### Steps

1. **Clone the Git Repository**
   - Repository URL: [MLFlow GitHub Repo](https://github.com/oneconvergence/mlflow)
   - Branch: `d3x-v2.21.2`

2. **Navigate to the Project Directory**
   ```bash
   cd mlflow/server/js
   ```

3. **Install Dependencies**
   ```bash
   yarn install
   ```

4. **Add Proxy in package.json**
   ```json
   "proxy": "your.domain.and.port"
   ```

5. **Login to dkubex and add _oauth2_proxy in cookies**
   - `_oauth2_proxy`: <_oauth2_proxy cookie from dkubex user>

6. **Modify FetchUtils.ts**
   - Navigate to `mlflow/server/js/src/common/utils/FetchUtils.ts`
   - Update the `getAjaxUrl` function as follows:
   ```typescript
   export const getAjaxUrl = (relativeUrl: any) => {
     return '/mlflow/' + relativeUrl;
   };
   ```
