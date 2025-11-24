/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import pako from 'pako';
import React, { Component } from 'react';
import { getArtifactContent, getArtifactLocationUrl } from '../../../common/utils/ArtifactUtils';
import './ShowArtifactTraceView.css';
import { ArtifactViewSkeleton } from './ArtifactViewSkeleton';

type ShowArtifactTraceViewState = {
  loading: boolean;
  error?: any;
  path: string;
  tracedata: string;
};

type ShowArtifactTraceViewProps = {
  runUuid: string;
  path: string;
  getArtifact: (artifactLocation: string, isBinary: boolean) => Promise<ArrayBufferLike>;
};

class ShowArtifactTraceView extends Component<ShowArtifactTraceViewProps, ShowArtifactTraceViewState> {
  iframeRef: any;
  constructor(props: ShowArtifactTraceViewProps) {
    super(props);
    this.fetchArtifacts = this.fetchArtifacts.bind(this);
    this.traceViewDataHandler = this.traceViewDataHandler.bind(this)
    this.iframeRef = React.createRef();
  }

  static defaultProps = {
    getArtifact: getArtifactContent,
  };

  state = {
    loading: true,
    error: undefined,
    path: '',
    tracedata: '',
  };

  componentDidMount() {
    this.fetchArtifacts();
    window.addEventListener('message', this.traceViewDataHandler, true);
  }

  componentDidUpdate(prevProps: ShowArtifactTraceViewProps) {
    if (this.props.path !== prevProps.path || this.props.runUuid !== prevProps.runUuid) {
      this.fetchArtifacts();
      window.addEventListener('message', this.traceViewDataHandler, true);
    }
  }

  componentWillUnmount() {
    // Avoid registering `traceViewDataHandler` every time this component mounts
    window.removeEventListener('message', this.traceViewDataHandler, true);
  }

  render() {
    if (this.state.loading || this.state.path !== this.props.path) {
      return <ArtifactViewSkeleton className="artifact-trace-view-loading" />;
    }
    if (this.state.error) {
      console.error('Unable to load Trace artifact, got error ' + this.state.error);
      return <div className="artifact-trace-view-error">Oops we couldn't load your file because of an error.</div>;
    } else {
      return (
        <div className="artifact-trace-view">
          <iframe
            ref={this.iframeRef}
            src="./static-files/lib/artifact-trace-viewer/trace_embedding.html"
            width="100%"
            height="100%"
            id="trace"
            className="trace-iframe"
            title="trace"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
          
        </div>
      );
    }
  }

  /** Fetches artifacts and updates component state with the result */
  fetchArtifacts() {
    const artifactLocation = getArtifactLocationUrl(this.props.path, this.props.runUuid);
    this.props
      .getArtifact(artifactLocation, true)
      .then((tracebindata: ArrayBufferLike) => {
        const uint8Array = new Uint8Array(tracebindata);
        let data = '';
        // Gzip files start with the magic number 0x1f 0x8b
        if (uint8Array[0] === 0x1f && uint8Array[1] === 0x8b) {
          try {
            data = pako.ungzip(uint8Array, { to: 'string' });
          } catch (error) {
            console.error('Decompression error:', error);
          }
        } else {
          data = new TextDecoder().decode(uint8Array);
        }
        this.setState({ tracedata: data, loading: false, path: this.props.path });
      })
      .catch((error: Error) => {
        this.setState({ error: error, loading: false, path: this.props.path });
      });
  }

  traceViewDataHandler(event: MessageEvent) {
    const data = event.data || {}
    if (data.msg === 'ready') {
      if (this.iframeRef.current && this.iframeRef.current.contentWindow) {
        this.iframeRef.current.focus();
        this.iframeRef.current.contentWindow.postMessage(
          { msg: 'data', data: this.state.tracedata },
          '*'
        );
      }
    }
  }
}

export default ShowArtifactTraceView;
