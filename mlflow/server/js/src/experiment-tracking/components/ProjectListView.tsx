import 'react-virtualized/styles.css';

import {
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListSelectItem,
  DialogComboboxTrigger,
  Typography,
} from '@databricks/design-system';
import React, { Component } from 'react';

import { ExperimentEntity } from '../types';
import { css } from '@emotion/react';

type Props = {
  experiments: ExperimentEntity[];
  project: string;
  handleProjectChange: any;
};

type State = any;

export const filterExperimentsByProject = (experiments:any, selectedProject:any) =>{
  if (selectedProject === "All") {
      return experiments;
  } else if (selectedProject === "Default") {
      return experiments.filter(
          (experiment:any) => !experiment.tags || !experiment.tags.some((tag:any) => tag.key.toLowerCase() === "project")
      );
  } else {
      return experiments.filter(
          (experiment:any) => experiment.tags && experiment.tags.some((tag:any) => tag.key.toLowerCase() === "project" && tag.value === selectedProject)
      );
  }
}
export class ProjectListView extends Component<Props, State> {

  listProjects = () => {
    const { experiments } = this.props;
    const projects = experiments
      .filter(experiment => {
        const projectTag = experiment.tags && experiment.tags.find((tag :any) => tag.key.toLowerCase() === "project");
        return projectTag !== undefined;
      })
      .map(experiment => {
        const projectTag = experiment.tags.find((tag:any) => tag.key.toLowerCase() === "project");
        return projectTag ? projectTag.value : null;
      });
      return ['All','Default', ...new Set(projects)];
  };
  
  render() {
    const projects = this.listProjects();
    return (
      <div css={classNames.projectsContainer}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Projects
        </Typography.Title>
        <DialogCombobox
            label={this.props.project}
          >
            <DialogComboboxTrigger
              data-test-id='project-select-dropdown'
              css={{ width: '100%' }}
            />
            <DialogComboboxContent>
              <DialogComboboxOptionList>
                {projects.map((project:any) => (
                  <DialogComboboxOptionListSelectItem
                    key={project}
                    checked={project === this.props.project}
                    title={this.props.project}
                    data-test-id={`project-select-${project}`}
                    value={this.props.project}
                    onChange={() => this.props.handleProjectChange(project)}
                  >
                    {project}
                  </DialogComboboxOptionListSelectItem>
                ))}
              </DialogComboboxOptionList>
            </DialogComboboxContent>
        </DialogCombobox>
      </div>
    );
  }
}

const classNames = {
  projectsContainer: {
    marginBottom: '8px',
    width:'100%'
  },
};

export default  ProjectListView;
