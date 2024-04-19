import React, { useState } from 'react';
import {
  Button, CircularProgress, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import FileSaver from 'file-saver';
import ProjectSelector from '../components/ProjectSelector';
import generateProjectAssets from '../services/generateProjectAssets';

const getAvailableFileTypes = (platform) => {
  switch (platform) {
    case 'web':
      return ['png', 'jpg', 'webp', 'svg'];
    case 'android':
      return ['png', 'svg'];
    case 'ios':
      return ['png', 'pdf', 'svg'];
    default:
      return [];
  }
};

export default function DownloadProjectAnnotations() {
  const [selectedProject, setSelectedProject] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const assets = await generateProjectAssets(selectedProject.id, selectedFileTypes);
      // Save the ZIP file using FileSaver
      FileSaver.saveAs(assets, `${selectedProject.name}_assets.zip`);
    } catch (error) {
      console.error('Error exporting assets:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const updateSelectedProjectState = (projectId) => {
    console.log('updating project selector state in parent', projectId);
    setSelectedProject(projectId);
  };

  const handleFileTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedFileTypes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <ProjectSelector
        updateSelectedProjectState={updateSelectedProjectState}
      />
      <FormControl fullWidth>
      <InputLabel>File Types</InputLabel>
      <Select
        value={selectedFileTypes}
        onChange={handleFileTypeChange}
        multiple
      >
        {getAvailableFileTypes(selectedProject.platform).map((fileType) => (
          <MenuItem key={fileType} value={fileType}>
            {fileType}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
      {isLoading ? (
        <CircularProgress /> // Display loading spinner while loading
      ) : (
        <Button variant="text" onClick={handleExport}>
          Download Selected Assets
        </Button>
      )}
    </>
  );
}
