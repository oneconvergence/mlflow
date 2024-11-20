import {
  Button,
  Empty,
  Input,
  RefreshIcon,
  SearchIcon,
  Spacer,
  Spinner,
  useDesignSystemTheme,
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  DialogComboboxOptionListSelectItem,
  DialogComboboxOptionListSearch,
  DialogComboboxTrigger,
  Switch,
} from '@databricks/design-system';
import Fuse from 'fuse.js';
import { compact, mapValues, values } from 'lodash';
import { useMemo, useState, useEffect } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getGridColumnSetup } from '../../../common/utils/CssGrid.utils';
import { ReduxState } from '../../../redux-types';
import { RunInfoEntity } from '../../types';
import { normalizeChartMetricKey } from '../../utils/MetricsUtils';
import { useChartMoveUpDownFunctions, useOrderedCharts } from '../runs-charts/hooks/useOrderedCharts';
import { RunsChartsTooltipWrapper } from '../runs-charts/hooks/useRunsChartsTooltip';
import { RunViewChartTooltipBody } from './RunViewChartTooltipBody';
import { RunViewMetricChart } from './RunViewMetricChart';
import { ChartRefreshManager, useChartRefreshManager } from './useChartRefreshManager';
import { DragAndDropProvider } from '../../../common/hooks/useDragAndDropElement';
import type { UseGetRunQueryResponseRunInfo } from './hooks/useGetRunQuery';

const { systemMetricChartsEmpty, modelMetricChartsEmpty } = defineMessages({
  systemMetricChartsEmpty: {
    defaultMessage: 'No system metrics recorded',
    description: 'Run page > Charts tab > System charts section > empty label',
  },
  modelMetricChartsEmpty: {
    defaultMessage: 'No model metrics recorded',
    description: 'Run page > Charts tab > Model charts section > empty label',
  },
});

const EmptyMetricsFiltered = () => (
  <Empty
    title="No matching metric keys"
    description="All metrics in this section are filtered. Clear the search filter to see hidden metrics."
  />
);

const EmptyMetricsNotRecorded = ({ label }: { label: React.ReactNode }) => <Empty title={label} description={null} />;

const metricKeyMatchesFilter = (filter: string, metricKey: string) =>
  metricKey.toLowerCase().includes(filter.toLowerCase()) ||
  normalizeChartMetricKey(metricKey).toLowerCase().includes(filter.toLowerCase());

/**
 * Internal component that displays a single collapsible section with charts
 */
const RunViewMetricChartsSection = ({
  metricKeys,
  filteredMetricKeys,
  search,
  runInfo,
  chartRefreshManager,
  onReorderChart,
  maxResults,
  showPoint,
}: {
  metricKeys: string[];
  filteredMetricKeys: string[];
  search: string;
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  onReorderChart: (sourceChartKey: string, targetChartKey: string) => void;
  chartRefreshManager: ChartRefreshManager;
  maxResults: number;
  showPoint: boolean;
}) => {
  const { theme } = useDesignSystemTheme();

  const { canMoveDown, canMoveUp, moveChartDown, moveChartUp } = useChartMoveUpDownFunctions(
    filteredMetricKeys,
    onReorderChart,
  );

  const gridSetup = useMemo(
    () => ({
      ...getGridColumnSetup({
        maxColumns: maxResults > 320 ? 1 : 3,
        gap: theme.spacing.lg,
        additionalBreakpoints: [{ breakpointWidth: 3 * 720, minColumnWidthForBreakpoint: 720 }],
      }),
      overflow: 'hidden',
    }),
    [theme, maxResults],
  );

  return filteredMetricKeys.length ? (
    <div css={gridSetup}>
      {filteredMetricKeys.map((metricKey, index) => (
        <RunViewMetricChart
          // Use both metric name and index as a key,
          // charts needs to be rerendered when order is changed
          key={`${metricKey}-${index}`}
          dragGroupKey="metricCharts"
          metricKey={metricKey}
          runInfo={runInfo}
          onReorderWith={onReorderChart}
          canMoveUp={canMoveUp(metricKey)}
          canMoveDown={canMoveDown(metricKey)}
          onMoveDown={() => moveChartDown(metricKey)}
          onMoveUp={() => moveChartUp(metricKey)}
          chartRefreshManager={chartRefreshManager}
          maxResults={maxResults}
          showPoint={showPoint}
        />
      ))}
    </div>
  ) : (
    <EmptyMetricsFiltered />
  );
};

/**
 * Component displaying metric charts for a single run
 */
export const RunViewMetricCharts = ({
  runInfo,
  metricKeys,
  mode,
}: {
  metricKeys: string[];
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  /**
   * Whether to display model or system metrics. This affects labels and tooltips.
   */
  mode: 'model' | 'system';
}) => {
  const chartRefreshManager = useChartRefreshManager();

  const metricsForRun = useSelector(({ entities }: ReduxState) => {
    return mapValues(entities.sampledMetricsByRunUuid[runInfo.runUuid ?? ''], (metricsByRange) => {
      return compact(
        values(metricsByRange)
          .map(({ metricsHistory }) => metricsHistory)
          .flat(),
      );
    });
  });

  const [search, setSearch] = useState('');
  const prevSample = localStorage.getItem('mlflow-run-chart-default-samples') || "320"
  const [maxSteps, setMaxSteps] = useState(parseInt(prevSample));
  const [showPoint, setShowPoint] = useState(false);
  const { formatMessage } = useIntl();
  const maxSamples = [320, 500, 1000, 2500]
  const { orderedMetricKeys, onReorderChart } = useOrderedCharts(metricKeys, 'RunView' + mode, runInfo.runUuid ?? '');

  // Setting up Fuse for Fuzzy Searching
  const fuseOptions = {
    includeScore: true,
    minMatchCharLength: 1, // Allows matching on single characters
    threshold: 0.6, // Adjust for stricter or more lenient matching
    shouldSort: true, // Prioritizes results by relevance
    matchAllTokens: true, // Ensures each keyword is matched somewhere in the string
    findAllMatches: true, // Matches even partial matches anywhere in the string
    useExtendedSearch: true // Allows partial matches within substrings
  };

  const fuse = new Fuse(metricKeys, fuseOptions);

  // Prepare the extended search pattern
  const searchTerms = search.split(" ").filter(Boolean); // Split by spaces and remove empty items
  const extendedSearchPattern = searchTerms.map(term => `"'${term}"`).join(" ");

  const filteredMetricKeys = search && search !== '' ? fuse.search(extendedSearchPattern).map((item) => item.item) : metricKeys;

  const noMetricsRecorded = !metricKeys.length;
  const allMetricsFilteredOut = !filteredMetricKeys.length;

  const showConfigArea = !noMetricsRecorded;
  const { theme } = useDesignSystemTheme();
  const showCharts = !noMetricsRecorded && !allMetricsFilteredOut;

  const tooltipContext = useMemo(() => ({ runInfo, metricsForRun }), [runInfo, metricsForRun]);

  const anyRunRefreshing = useSelector((store: ReduxState) => {
    return values(store.entities.sampledMetricsByRunUuid[runInfo.runUuid ?? '']).some((metricsByRange) =>
      values(metricsByRange).some(({ refreshing }) => refreshing),
    );
  });

  // on samples to render change, refresh all charts
  useEffect(() => {
    chartRefreshManager.refreshAllCharts();
  }, [maxSteps]);

  return (
    <DragAndDropProvider>
      <div css={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div css={{ flexShrink: 0 }}>
          {showConfigArea && (
            <div css={{ display: 'flex', gap: theme.spacing.sm }}>
              <Input
                role="searchbox"
                prefix={<SearchIcon />}
                value={search}
                allowClear
                onChange={(e) => setSearch(e.target.value)}
                placeholder={formatMessage({
                  defaultMessage: 'Search metric charts',
                  description: 'Run page > Charts tab > Filter metric charts input > placeholder',
                })}
              />
              <DialogCombobox
                label={formatMessage({
                  defaultMessage: 'Samples',
                  description: 'Number of Samples to render',
                })}
                value={[maxSteps.toString()]}
              >
                <DialogComboboxTrigger allowClear={false} data-testid="max-samples" />
                <DialogComboboxContent>
                  <DialogComboboxOptionList>
                    {maxSamples.map((sample) => {
                      return (
                        <DialogComboboxOptionListSelectItem
                          checked={maxSteps === sample}
                          key={sample}
                          data-testid={'max-samples-' + sample}
                          value={sample.toString()}
                          onChange={() => {
                            setMaxSteps(sample);
                            localStorage.setItem('mlflow-run-chart-default-samples', sample.toString());
                          }}
                        >
                          {sample}
                        </DialogComboboxOptionListSelectItem>
                      );
                    })}
                  </DialogComboboxOptionList>
                </DialogComboboxContent>
              </DialogCombobox>
              <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
                <div>
                  <FormattedMessage
                    defaultMessage="Points:"
                    // eslint-disable-next-line max-len
                    description="Label for the toggle button to toggle to show points or not for the metric experiment run"
                  />
                </div>
                <Switch
                  data-testid="show-point-toggle"
                  defaultChecked={showPoint}
                  onChange={() => setShowPoint(!showPoint)}
                />
              </div>
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewmetriccharts.tsx_176"
                icon={
                  anyRunRefreshing ? <Spinner size="small" css={{ marginRight: theme.spacing.sm }} /> : <RefreshIcon />
                }
                onClick={() => {
                  if (!anyRunRefreshing) {
                    chartRefreshManager.refreshAllCharts();
                  }
                }}
              >
                <FormattedMessage
                  defaultMessage="Refresh"
                  description="Run page > Charts tab > Refresh all charts button label"
                />
              </Button>
            </div>
          )}
          <Spacer />
        </div>
        {noMetricsRecorded && (
          <EmptyMetricsNotRecorded
            label={<FormattedMessage {...(mode === 'model' ? modelMetricChartsEmpty : systemMetricChartsEmpty)} />}
          />
        )}
        {allMetricsFilteredOut && <EmptyMetricsFiltered />}
        {/* Scroll charts independently from filter box */}
        <div css={{ flex: 1, overflow: 'auto' }}>
          <RunsChartsTooltipWrapper contextData={tooltipContext} component={RunViewChartTooltipBody} hoverOnly>
            {showCharts && (
              <RunViewMetricChartsSection
                metricKeys={orderedMetricKeys}
                filteredMetricKeys={filteredMetricKeys}
                runInfo={runInfo}
                search={search}
                onReorderChart={onReorderChart}
                chartRefreshManager={chartRefreshManager}
                maxResults={maxSteps}
                showPoint={showPoint}
              />
            )}
          </RunsChartsTooltipWrapper>
        </div>{' '}
      </div>
    </DragAndDropProvider>
  );
};
