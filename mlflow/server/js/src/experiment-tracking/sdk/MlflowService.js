/**
 * DO NOT EDIT!!!
 *
 * @NOTE(dli) 12-21-2016
 *   This file is generated. For now, it is a snapshot of the proto services as of
 *   Aug 1, 2018 3:42:41 PM. We will update the generation pipeline to actually
 *   place these generated objects in the correct location shortly.
 */

import $ from 'jquery';
import JsonBigInt from 'json-bigint';
import Utils from '../../common/utils/Utils';
import moment from 'moment';

const StrictJsonBigInt = JsonBigInt({ strict: true, storeAsString: true });

export class MlflowService {

  static runInfos = {};
  /**
   * @param {CreateExperiment} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static createExperiment({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/experiments/create'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {DeleteExperiment} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static deleteExperiment({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/experiments/delete'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {UpdateExperiment} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static updateExperiment({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/experiments/update'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {ListExperiments} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static listExperiments({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/experiments/list'), {
      type: 'GET',
      dataType: 'json',
      converters: {
        'text json': StrictJsonBigInt.parse,
      },
      data: data,
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {GetExperiment} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static getExperiment({ data, success, error }) {
    success({ experiment: { experiment_id: 0 } });
  }

  /**
   * @param {GetExperimentByName} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static getExperimentByName({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/mlflow/experiments/get-by-name'), {
      type: 'GET',
      dataType: 'json',
      converters: {
        'text json': StrictJsonBigInt.parse,
      },
      data: data,
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {CreateRun} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static createRun({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/create'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {DeleteRun} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static deleteRun({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/delete'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }
  /**
   * @param {RestoreRun} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static restoreRun({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/restore'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {UpdateRun} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static updateRun({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/update'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {LogMetric} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static logMetric({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/log-metric'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {LogParam} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static logParam({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/log-parameter'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  static getMetricsByUuid(data, error, success) {
    return $.ajax(`${process.env.REACT_APP_API_SERVER}/dkube/v2/prometheus/api/v1/query_range?query={runid="${data.run_uuid}"}&start=${data.start_time}&end=${data.end_time}&step=5`, {
      type: 'GET',
      dataType: 'json',
      converters: {
        'text json': StrictJsonBigInt.parse,
      },
      jsonp: false,
      success: function (response) {
        const { result } = response.data;
        let metrics = [];
        let temp = {};
        result.forEach(function (res) {
          if (res.metric.__name__ !== 'step') {
            if (temp[res.metric.__name__]) {
              if (parseInt(res.metric.step, 10) > parseInt(temp[res.metric.__name__].step, 10)) {
                temp[res.metric.__name__] = { timestamp: res.metric.timestamp, step: res.metric.step, value: parseFloat(res.values[0][1]), key: res.metric.__name__ };
              }
            } else {
              temp[res.metric.__name__] = { timestamp: res.metric.timestamp, step: res.metric.step, value: parseFloat(res.values[0][1]), key: res.metric.__name__ };
            }
          }
        });
        Object.keys(temp).forEach(t => metrics.push(temp[t]));
        const runInfo = {
          run_uuid: data.run_uuid,
          run_id: data.run_uuid,
          start_time: data.start_time * 1000,
          end_time: data.end_time * 1000,
          ...(result.length ? { run_name: result[0].metric.run_name } : {})

        };
        response.run = {
          info: runInfo,
          data: {
            metrics,
            params: [],
            tags: [...(runInfo.run_name ? [{ value: runInfo.run_name, key: "mlflow.runName" }] : [])]
          }
        };
        delete response.data;
        success(response);
      },
      error: error,
    });
  }

  /**
   * @param {GetRun} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   * Please note that the params are empty here. Once we're able to fetch it,
   * params in the below code needs to be updated 
   */
  static getRun({ data, success, error }) {
    if (MlflowService.runInfos[data.run_uuid]) {
      MlflowService.getMetricsByUuid(MlflowService.runInfos[data.run_uuid], error, function (response) {
        success(response);
      });
    }
    else {
      return $.ajax(`${process.env.REACT_APP_API_SERVER}/dkube/v2/controller/jobs/uuid/${data.run_uuid}`, {
        type: 'GET',
        dataType: 'json',
        headers: {
          Authorization: localStorage.getItem('token')
            ? 'Bearer ' + localStorage.getItem('token')
            : ''
        },
        jsonp: false,
        success: function (response) {
          const start = response.data['parameters']['generated']['timestamps']['start']
          const end = response.data['parameters']['generated']['timestamps']['end']
          const runInfo = {
            run_id: data.run_uuid,
            start_time: moment.utc(start).valueOf() / 1000,
            run_uuid: data.run_uuid,
            end_time: (moment.utc(end).valueOf() / 1000) + 60,
            experimentId: 0
          };
          MlflowService.getMetricsByUuid(runInfo, error, function (response) {
            success(response);
          });
        },
        error: error,
      });
    }
  }

  /**
   * @param {SearchRuns} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static searchRuns({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/search'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {ListArtifacts} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static listArtifacts({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/artifacts/list'), {
      type: 'GET',
      dataType: 'json',
      converters: {
        'text json': StrictJsonBigInt.parse,
      },
      data: data,
      jsonp: false,
      success: success,
      error: error,
    });
  }

  static getMetricByUuid(data, error, success) {
    return $.ajax(`${process.env.REACT_APP_API_SERVER}/dkube/v2/prometheus/api/v1/query_range?query=${data.metric_key}{runid="${data.run_uuid}"}&start=${data.start_time}&end=${data.end_time}&step=5`, {
      type: 'GET',
      dataType: 'json',
      converters: {
        'text json': StrictJsonBigInt.parse,
      },
      jsonp: false,
      success: function (response) {
        const { result } = response.data;
        if (result && result.length > 0) {
          response.metrics = result.map(res => {
            return { timestamp: res.metric.timestamp, step: res.metric.step, value: parseFloat(res.values[0][1]), key: data.metric_key };
          });
        }
        delete response.data;
        success(response);
      },
      error: error,
    });
  }

  /**
   * @param {GetMetricHistory} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static getMetricHistory({ data, success, error }) {
    if (MlflowService.runInfos[data.run_uuid]) {
      const runInfo = { metric_key: data.metric_key, ...MlflowService.runInfos[data.run_uuid] };
      MlflowService.getMetricByUuid(runInfo, error, function (response) {
        success(response);
      });
    }
    else {
      return $.ajax(`${process.env.REACT_APP_API_SERVER}/dkube/v2/controller/jobs/uuid/${data.run_uuid}`, {
        type: 'GET',
        dataType: 'json',
        headers: {
          Authorization: localStorage.getItem('token')
            ? 'Bearer ' + localStorage.getItem('token')
            : ''
        },
        jsonp: false,
        success: function (response) {
          const start = response.data['parameters']['generated']['timestamps']['start']
          const end = response.data['parameters']['generated']['timestamps']['end']
          const runInfo = {
            metric_key: data.metric_key,
            run_id: data.run_uuid,
            start_time: moment.utc(start).valueOf() / 1000,
            run_uuid: data.run_uuid,
            end_time: (moment.utc(end).valueOf() / 1000) + 60,
            experimentId: 0
          };
          MlflowService.getMetricByUuid(runInfo, error, function (response) {
            success(response);
          });
        },
        error: error,
      });
    }
  }

  /**
   * @param {SetTag} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static setTag({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/set-tag'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {DeleteTag} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static deleteTag({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/runs/delete-tag'), {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }

  /**
   * @param {SetExperimentTag} data: Immutable Record
   * @param {function} success
   * @param {function} error
   * @return {Promise}
   */
  static setExperimentTag({ data, success, error }) {
    return $.ajax(Utils.getAjaxUrl('ajax-api/2.0/preview/mlflow/experiments/set-experiment-tag'), {
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data),
      jsonp: false,
      success: success,
      error: error,
    });
  }
}
