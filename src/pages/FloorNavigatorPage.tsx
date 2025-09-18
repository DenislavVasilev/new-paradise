import React from 'react';
import FloorPlansViewer from '../components/FloorPlansViewer';

const FloorNavigatorPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="pt-24">
        <div className="container-custom">
          <FloorPlansViewer />
        </div>
      </div>
    </div>
  );
};

export default FloorNavigatorPage;