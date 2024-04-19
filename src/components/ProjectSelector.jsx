import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { ZeplinApi, Configuration } from '@zeplin/sdk';
import { useWorkspaceId } from '../services/workspaceContext';
import getWorkspaceProjects from '../services/getWorkspaceProjects';

const zeplin = new ZeplinApi(new Configuration({ accessToken: localStorage.getItem('zeplinAccessToken') }));

function ProjectSelector({ updateSelectedProjectState }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const { workspaceId } = useWorkspaceId();

  const handleOnSelect = (e) => {
    const { value } = e.target;
    setSelectedProject(value);
    updateSelectedProjectState(value);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Check if workspaceId is not null before fetching projects
        if (workspaceId) {
          const data = await getWorkspaceProjects(workspaceId, zeplin);
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    fetchData();
    // Cleanup function (optional)
    return () => {
      // Perform any cleanup (if needed)
    };
  }, [workspaceId]);

  return (
    <FormControl fullWidth disabled={!workspaceId}>
      <InputLabel>{!workspaceId ? 'Please Select Workspace First' : 'Select Project'}</InputLabel>
      <Select placeholder={!workspaceId ?  'Select Workspace' : 'Select Project'} label="Project" onChange={handleOnSelect}>
        {projects.length > 0 && projects.map((project) => (
          <MenuItem key={project.id} value={project}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

ProjectSelector.propTypes = {
  updateSelectedProjectState: PropTypes.func.isRequired,
};

export default ProjectSelector;
