import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useWorkspaceId } from '../services/workspaceContext';

const { VITE_EXPRESS_SERVER_BASE_URL } = import.meta.env;

function WorkspaceSelector() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { workspaceId, setWorkspaceId } = useWorkspaceId();

  const handleOnSelect = (e) => {
    const { value } = e.target;
    setWorkspaceId(value);
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await axios.get(`${VITE_EXPRESS_SERVER_BASE_URL}/api/v1/workspaces`);
        console.log('workspaces', data);
        setWorkspaces(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
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
    <Select
      placeholder="Select workspace..."
      value={workspaceId}
      defaultValue={workspaceId}
      onChange={handleOnSelect}
    >
      {workspaces.length > 0 && workspaces.map((workspace) => (
        <MenuItem key={workspace.id} value={workspace.id}>
          {workspace.name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default WorkspaceSelector;