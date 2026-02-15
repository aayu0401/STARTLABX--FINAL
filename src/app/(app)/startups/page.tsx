'use client';

import React, { useState } from 'react';
import { ShowcaseHeader } from './components/showcase-header';
import { StartupsGrid } from './components/startups-grid';
import { CreateStartupModal } from './components/create-startup-modal';

export default function StartupsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <ShowcaseHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      <StartupsGrid key={refreshKey} />

      <CreateStartupModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
