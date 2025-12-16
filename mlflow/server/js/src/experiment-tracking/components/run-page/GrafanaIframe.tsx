import React from 'react';

interface IframeProps {
    runUuid?: string;
    width?: string;
    height?: string;
}

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

export default GrafanaIframe;
