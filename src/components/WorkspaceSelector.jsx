import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { ZeplinApi, Configuration } from '@zeplin/sdk';
import { useWorkspaceId } from '../providers/WorkspaceIdProvider';
import getWorkspaces from '../services/getWorkspaces';

const zeplin = new ZeplinApi(new Configuration({ accessToken: localStorage.getItem('zeplinAccessToken') }));
const { VITE_ZEPLIN_CLIENT_ID, VITE_ZEPLIN_CLIENT_SECRET } = import.meta.env;

function WorkspaceSelector() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setWorkspaceId } = useWorkspaceId();

  const handleOnSelect = (e) => {
    const { value } = e.target;
    setWorkspaceId(value);
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await getWorkspaces(zeplin, VITE_ZEPLIN_CLIENT_ID, VITE_ZEPLIN_CLIENT_SECRET);
        setWorkspaces(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workspaces in useEffect:', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchWorkspaces();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (workspaces.length === 0) {
    return <div>No workspaces available</div>;
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Select Workspace</InputLabel>
      <Select
        placeholder="Select workspace..."
        onChange={handleOnSelect}
        label="workspace"
      >
        {workspaces.length > 0 && workspaces.map((workspace) => (
          <MenuItem key={workspace.id} value={workspace.id}>
            {workspace.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default WorkspaceSelector;
