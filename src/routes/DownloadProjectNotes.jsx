import React, { useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import FileSaver from 'file-saver';
import ProjectSelector from '../components/ProjectSelector';
import generateProjectNotes from '../services/generateProjectNotes';

export default function DownloadProjectAnnotations() {
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const csv = await generateProjectNotes(selectedProject.id);
      console.log(csv);
      const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      FileSaver.saveAs(csvData, 'notes.csv');
    } catch (error) {
      console.error('Error exporting notes:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const updateSelectedProjectState = (projectId) => {
    console.log('updating project selector state in parent', projectId);
    setSelectedProject(projectId);
  };

  return (
    <>
      <ProjectSelector
        updateSelectedProjectState={updateSelectedProjectState}
      />
      {isLoading ? (
        <CircularProgress /> // Display loading spinner while loading
      ) : (
        <Button variant="text" onClick={handleExport}>
          Download Notes and Comments
        </Button>
      )}
    </>
  );
}
