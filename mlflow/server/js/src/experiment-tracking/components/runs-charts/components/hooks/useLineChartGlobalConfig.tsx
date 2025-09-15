import { isUndefined, pick } from 'lodash';
import type { RunsChartsLineCardConfig } from '../../runs-charts.types';
import type { RunsChartsGlobalLineChartConfig } from '../../../experiment-page/models/ExperimentPageUIState';
import { useMemo } from 'react';
import { RunsChartsLineChartXAxisType } from '../RunsCharts.common';

/**
 * A utility hook that selects if certain line chart settings should be
 * taken from global configuration or from local chard card settings.
 */
export const useLineChartGlobalConfig = (
  originalCardConfig: RunsChartsLineCardConfig,
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig,
) =>
  useMemo(() => {
    const result = pick(originalCardConfig, ['xAxisKey', 'selectedXAxisMetricKey', 'lineSmoothness', 'displayPoints']);

    if (!globalLineChartConfig) {
      return result;
    }

    const globalXAxisKey = globalLineChartConfig.xAxisKey;

    if (originalCardConfig.useGlobalLineSmoothing && !isUndefined(globalLineChartConfig.lineSmoothness)) {
      result.lineSmoothness = globalLineChartConfig.lineSmoothness;
    }

    if (!isUndefined(globalXAxisKey) && originalCardConfig.useGlobalXaxisKey) {
      result.xAxisKey = globalXAxisKey;
      const globalSelectedXAxisMetricKey = globalLineChartConfig?.selectedXAxisMetricKey;
      if (globalXAxisKey === RunsChartsLineChartXAxisType.METRIC && globalSelectedXAxisMetricKey) {
        result.selectedXAxisMetricKey = globalSelectedXAxisMetricKey;
      }
    }

    // Add displayPoints if available in global config
    if (!isUndefined(globalLineChartConfig.displayPoints)) {
      result.displayPoints = globalLineChartConfig.displayPoints;
    }

    // Add maxResults if available in global config
    if (!isUndefined(globalLineChartConfig.maxResults)) {
      (result as any).maxResults = globalLineChartConfig.maxResults;
    }

    return result;
  }, [originalCardConfig, globalLineChartConfig]);
