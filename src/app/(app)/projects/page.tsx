'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectsHeader } from './components/projects-header';
import { BoardTab } from './tabs/board-tab';
import { DataTab } from './tabs/data-tab';
import { DevOpsTab } from './tabs/devops-tab';
import { ListTab } from './tabs/list-tab';
import { CalendarTab } from './tabs/calendar-tab';

export default function ProjectsPage() {
  return (
    <div className="h-full flex flex-col">
      <ProjectsHeader />

      <Tabs defaultValue="board" className="flex-grow flex flex-col">
        <TabsList className="mb-4 self-start">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="devops">DevOps</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="flex-grow">
          <BoardTab />
        </TabsContent>
        <TabsContent value="data">
          <DataTab />
        </TabsContent>
        <TabsContent value="devops">
          <DevOpsTab />
        </TabsContent>
        <TabsContent value="list">
          <ListTab />
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
