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
- [Metric History Sampling](#metric-history-sampling)
- [Run View Metric Charts UI Enhancements](#run-view-metric-charts-ui-enhancements)

### Build & Configuration
- [NPM Configuration](#npm-configuration)
- [Design System Update](#design-system-update)
- [Setup Script Removal](#setup-script-removal)
- [Type Updates](#type-updates)

### Docker Image Build
- [Dockerfile Changes](#dockerfile-changes)

---

## New Features

### 1. PyTorch Trace Viewer

**Files:**
- `mlflow/server/js/public/lib/artifact-trace-viewer/trace_embedding.html` (new)
- `mlflow/server/js/public/lib/artifact-trace-viewer/trace_viewer_full.html` (new)
- `mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTraceView.tsx` (new)
- `mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTraceView.css` (new)

**Description:** Added support for viewing PyTorch trace files (`.pt.trace.json`, `.pt.trace.json.gz`) as artifacts with an embedded trace viewer interface.

**Key Implementation:**

```typescript
// ShowArtifactTraceView.tsx - Main component structure
class ShowArtifactTraceView extends Component<ShowArtifactTraceViewProps, ShowArtifactTraceViewState> {
  fetchArtifacts() {
    const artifactLocation = getArtifactLocationUrl(this.props.path, this.props.runUuid);
    this.props.getArtifact(artifactLocation, true)
      .then((tracebindata: ArrayBufferLike) => {
        const uint8Array = new Uint8Array(tracebindata);
        // Gzip files start with the magic number 0x1f 0x8b
        if (uint8Array[0] === 0x1f && uint8Array[1] === 0x8b) {
          data = pako.ungzip(uint8Array, { to: 'string' });
        } else {
          data = new TextDecoder().decode(uint8Array);
        }
        this.setState({ tracedata: data, loading: false, path: this.props.path });
      });
  }

  render() {
    return (
      <div className="artifact-trace-view">
        <iframe
          src="./static-files/lib/artifact-trace-viewer/trace_embedding.html"
          width="100%"
          height="100%"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }
}
```

### 2. Grafana Logs Integration

**Files:**
- `mlflow/server/js/src/experiment-tracking/components/run-page/GrafanaIframe.tsx` (new)
- `mlflow/server/js/src/experiment-tracking/components/run-page/RunPage.tsx`
- `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewModeSwitch.tsx`
- `mlflow/server/js/src/experiment-tracking/components/run-page/useRunViewActiveTab.tsx`
- `mlflow/server/js/src/experiment-tracking/constants.ts`

**Description:** Added a new "Logs" tab in the run page that embeds Grafana dashboards for viewing run logs.

**Key Implementation:**

```typescript
// GrafanaIframe.tsx - New component
const GrafanaIframe: React.FC<IframeProps> = ({ runUuid, width = '100%', height = '100%' }) => {
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const src = `${baseUrl}/grafana/d/depiaxha35ds0e/mlflow-logger?orgId=1&from=now-2d&to=now&timezone=browser&var-runid=${runUuid}&var-level=$__all&var-search=&theme=dark`;
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      style={{ border: 'none' }}
      title="Grafana MLflow Logger"
    />
  );
};
```

```typescript
// constants.ts - Added new tab constant
export enum RunPageTabName {
  // ... existing tabs
  LOGS = 'logs',
}
```

### 3. Project-Based Experiment Filtering

**Files:**
- `mlflow/server/js/src/experiment-tracking/components/ProjectListView.tsx` (new)

**Description:** Added `ProjectListView` component for filtering experiments by project tags (All, Default, or specific project names).

**Key Implementation:**

```typescript
// ProjectListView.tsx - Filter function
export const filterExperimentsByProject = (experiments: any, selectedProject: any) => {
  if (selectedProject === "All") {
    return experiments;
  } else if (selectedProject === "Default") {
    return experiments.filter(
      (experiment: any) => !experiment.tags ||
      !experiment.tags.some((tag: any) => tag.key.toLowerCase() === "project")
    );
  } else {
    return experiments.filter(
      (experiment: any) => experiment.tags &&
      experiment.tags.some((tag: any) =>
        tag.key.toLowerCase() === "project" && tag.value === selectedProject
      )
    );
  }
}

// Component with project selector
export class ProjectListView extends Component<Props, State> {
  listProjects = () => {
    const { experiments } = this.props;
    const projects = experiments
      .filter(experiment => {
        const projectTag = experiment.tags?.find((tag: any) => tag.key.toLowerCase() === "project");
        return projectTag !== undefined;
      })
      .map(experiment => {
        const projectTag = experiment.tags.find((tag: any) => tag.key.toLowerCase() === "project");
        return projectTag ? projectTag.value : null;
      });
    return ['All', 'Default', ...new Set(projects)];
  };
}
```

### 4. Enhanced Metric Charts

**Files:**
- `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.tsx`
- `mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsLineChartCard.tsx`
- `mlflow/server/js/src/experiment-tracking/components/experiment-page/models/ExperimentPageUIState.tsx`

**Description:** Added `maxResults` and `showPoint` configuration options for metric charts, allowing customizable data point limits and point display with UI controls and localStorage persistence.

**Key Implementation:**

```typescript
// ExperimentPageUIState.tsx - Extended type
export type RunsChartsGlobalLineChartConfig = Partial<
  Pick<RunsChartsLineCardConfig, 'selectedXAxisMetricKey' | 'xAxisKey' | 'lineSmoothness' | 'displayPoints'> &
  { maxResults?: number }
>;
```

```typescript
// RunViewMetricCharts.tsx - UI controls and state management
const maxSamples = [320, 500, 1000, 2500];
const prevSample = localStorage.getItem('mlflow-run-chart-default-samples') || '320';
const [maxSteps, setMaxSteps] = useState(parseInt(prevSample, 10));
const [showPoint, setShowPoint] = useState(false);

// Samples dropdown
<DialogCombobox
  componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewmetriccharts.tsx_samples"
  label={formatMessage({ defaultMessage: 'Samples' })}
  value={[maxSteps.toString()]}
>
  <DialogComboboxTrigger allowClear={false} data-testid="max-samples" />
  <DialogComboboxContent>
    <DialogComboboxOptionList>
      {maxSamples.map((sample) => (
        <DialogComboboxOptionListSelectItem
          checked={maxSteps === sample}
          key={sample}
          value={sample.toString()}
          onChange={() => {
            setMaxSteps(sample);
            localStorage.setItem('mlflow-run-chart-default-samples', sample.toString());
          }}
        >
          {sample}
        </DialogComboboxOptionListSelectItem>
      ))}
    </DialogComboboxOptionList>
  </DialogComboboxContent>
</DialogCombobox>

// Points toggle
<Switch
  componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewmetriccharts.tsx_show-point"
  checked={showPoint}
  onChange={() => setShowPoint(!showPoint)}
/>
```

```typescript
// RunsChartsLineChartCard.tsx - Using global config
maxResults: globalLineChartConfig?.maxResults ?? 320,
displayPoints: globalLineChartConfig?.displayPoints ?? config.displayPoints,
```

## Feature Flags & Configuration

### Disabled Features

**Files:**
- `mlflow/server/js/src/common/utils/FeatureUtils.ts`
- `mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.fetch-utils.ts`

**Changes:**

```typescript
// FeatureUtils.ts
export const shouldEnableDeepLearningUI = () => false;
export const shouldEnableExperimentDatasetTracking = () => false;
```

```typescript
// experimentPage.fetch-utils.ts
export const shouldRefetchRuns = () => true;
```

## UI/UX Improvements

### Component IDs for Testing/Accessibility

**Files:**
- `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.tsx`
- `mlflow/server/js/src/experiment-tracking/components/ProjectListView.tsx`

**Description:** Added `componentId` props to UI components for improved testability and accessibility.

**Example:**

```typescript
// ProjectListView.tsx
<DialogCombobox
  componentId="mlflow.project_list.project_selector"
  label={this.props.project}
>
```

### Performance & Limits

**Files:** `mlflow/server/js/src/experiment-tracking/components/MetricsPlotPanel.tsx`

**Changes:** Increased maximum metric data points limit.

```typescript
// MetricsPlotPanel.tsx
const MAXIMUM_METRIC_DATA_POINTS = 1_000_000; // Previously 100,000
```

### Metric Filtering Enhancement

**Files:**
- `mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewMetricsTable.tsx`
- `mlflow/server/js/src/experiment-tracking/utils/MetricsUtils.ts`

**Description:** Enhanced metric filtering to support normalized metric keys (stripping system metric prefixes) for better search functionality.

**Key Implementation:**

```typescript
// MetricsUtils.ts - New utility function
export const normalizeChartMetricKey = (metricKey: string) => {
  return metricKey.replace(systemMetricPrefix, '');
};
```

```typescript
// RunViewMetricsTable.tsx - Enhanced filter
const metricKeyMatchesFilter = (filter: string) => ({ key }: MetricEntity) =>
  key.toLowerCase().includes(filter.toLowerCase()) ||
  normalizeChartMetricKey(key).toLowerCase().includes(filter.toLowerCase());
```

## Routing & Navigation

### React Router Updates

**Files:**
- `mlflow/server/js/src/common/utils/RoutingUtils.tsx`

**Changes:**
- Removed React Router V5 imports (`HashRouter as HashRouterV5`, `Link as LinkV5`, `NavLink as NavLinkV5`)
- Added `NavLink` export to routing utils exports

```typescript
// RoutingUtils.tsx
// Removed: HashRouter as HashRouterV5, Link as LinkV5, NavLink as NavLinkV5
// Added: NavLink export
export { NavLink } from 'react-router-dom';
```

## File Handling

### Trace File Support

**Files:**
- `mlflow/server/js/src/common/utils/FileUtils.ts`
- `mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactPage.tsx`

**Changes:**
- Added `TRACE_EXTENSIONS` constant for `.pt.trace.json` and `.pt.trace.json.gz` files
- Enhanced `getExtension()` function to properly detect trace file extensions with compression suffixes

**Key Implementation:**

```typescript
// FileUtils.ts
export const TRACE_EXTENSIONS = new Set(['pt.trace.json', 'pt.trace.json.gz']);

export const getExtension = (path: string) => {
  const tracefileRegex = /.*\.(pt\.trace\.json(?:\.gz|\.zip)?)$/;
  const traceMatch = path.match(tracefileRegex);

  if (traceMatch) {
    return traceMatch[1];
  } else {
    const parts = path.split(/[./]/);
    return parts[parts.length - 1];
  }
};
```

### Artifact View Styling

**Files:** `mlflow/server/js/src/experiment-tracking/components/ArtifactView.css`

**Changes:** Added layout styles for proper artifact view rendering.

```css
/* ArtifactView.css */
.artifact-view {
  height: 100%;
  width: 100%;
  position: relative;
}
```

## Bug Fixes & Improvements

### Plot Layout Parsing

**Files:** `mlflow/server/js/src/common/utils/Utils.tsx`

**Description:** Fixed JSON parsing of plot layout by removing whitespace before parsing to prevent parsing errors.

**Key Implementation:**

```typescript
// Utils.tsx - Before
const layout = params['plot_layout'] ? JSON.parse(params['plot_layout']) : { autosize: true };

// After
const layoutStr = params['plot_layout'] ? params['plot_layout'].replaceAll(" ", "") : undefined;
const layout = layoutStr ? JSON.parse(layoutStr) : { autosize: true };
```

### Metric History Sampling

**Files:** `mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useSampledMetricHistory.tsx`

**Changes:** Changed sampling mode from `'all'` to `'auto'` for better performance.

```typescript
// useSampledMetricHistory.tsx
// Before
const action = getSampledMetricHistoryBulkAction(runUuidsChunk, metricKey, maxResults, range, 'all');

// After
const action = getSampledMetricHistoryBulkAction(runUuidsChunk, metricKey, maxResults, range, 'auto');
```

### Run View Metric Charts UI Enhancements

**Files:** `mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.tsx`

**Changes:**
- Added UI controls for samples selection (dropdown with options: 320, 500, 1000, 2500)
- Added toggle switch for showing/hiding data points
- Added localStorage persistence for default samples preference (`mlflow-run-chart-default-samples`)
- Added `useEffect` hook to sync `maxSteps` and `showPoint` state with global line chart config
- Added `componentId` prop for testing/accessibility

**Key Implementation:**

```typescript
// RunViewMetricCharts.tsx - State sync with global config
useEffect(() => {
  updateChartsUIState((current) => ({
    ...current,
    globalLineChartConfig: {
      ...current.globalLineChartConfig,
      maxResults: maxSteps,
      displayPoints: showPoint,
    },
  }));
}, [maxSteps, showPoint, updateChartsUIState]);
```

## Build & Configuration

### NPM Configuration

**Files:** `mlflow/server/js/.npmrc` (new)

**Description:** Added NPM registry configuration file.

### Design System Update

**Files:** `mlflow/server/js/yarn.lock`

**Description:** Updated `@databricks/design-system` dependency hash.

### Setup Script Removal

**Files:** `setup.py` (deleted)

**Description:** Removed legacy `setup.py` file (migration to `pyproject.toml`).

### Type Updates

**Files:**
- `mlflow/server/js/src/experiment-tracking/types.ts`
- `mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsTable.tsx`

**Changes:**

```typescript
// types.ts - Added new type export
export type UpdateExperimentSearchFacetsFn = any;
```

## Docker Image Build

### Dockerfile Changes

**Files:** `Dockerfile`

**Changes:**
- Changed base image from `python:3.10-bullseye` to `python:3.10.10-slim-bullseye`
- Added build dependencies: `build-essential`, `git`, `gnupg`, `gnupg2`, `curl`
- Updated Node.js installation method (using nodesource repository with GPG key)
- Updated Yarn installation method (using official Debian repository)
- Added pip packages: `psycopg2-binary`, `PyMySQL`, `boto3`, `setuptools`, `wheel`, `fastapi[all]==0.103.1`, `uvicorn==0.23.2`
- Added build steps: `COPY . /mlflow`, `WORKDIR /mlflow/mlflow/server/js`, `yarn install`, `yarn build`
- Changed `WORKDIR` to `/mlflow` and installed MLflow with `pip install .[auth]`
- Changed `ENTRYPOINT` to run `mlflow server --host 0.0.0.0`
- Removed `CMD ["bash"]`

**Key Changes:**

```dockerfile
# Dockerfile
# Base image change
FROM python:3.10.10-slim-bullseye

# Build dependencies
RUN apt update && apt install -y build-essential git gnupg gnupg2 curl --no-install-recommends

# Node.js installation with GPG key
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install nodejs -y

# Yarn installation
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 1646B01B86E50310 \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt update && apt install yarn -y ca-certificates

# Python packages
RUN pip install --upgrade pip \
    psycopg2-binary \
    PyMySQL \
    boto3 \
    setuptools \
    wheel \
    fastapi[all]==0.103.1 \
    uvicorn==0.23.2

# Build frontend
COPY . /mlflow
WORKDIR /mlflow/mlflow/server/js
RUN yarn install
RUN yarn build

# Install MLflow
WORKDIR /mlflow
RUN pip install .[auth]

# Entrypoint
ENTRYPOINT ["mlflow", "server", "--host", "0.0.0.0"]
```

---
