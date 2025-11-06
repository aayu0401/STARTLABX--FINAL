"use client";
import React from 'react';
import { KanbanColumn } from '../components/kanban-column';
import { TaskCard, TaskData } from '../components/task-card';

const tasks: { todo: TaskData[]; inProgress: TaskData[]; done: TaskData[] } = {
  todo: [
    { id: 'task-1', title: 'Design new landing page hero', priority: 'High', tags: ['UI/UX', 'Design'] },
    { id: 'task-2', title: 'Setup CI/CD pipeline', priority: 'Medium', tags: ['DevOps'] },
    { id: 'task-3', title: 'Draft Q3 marketing plan', priority: 'Low', tags: ['Marketing'] },
  ],
  inProgress: [
    { id: 'task-4', title: 'Develop user authentication flow', priority: 'High', tags: ['Frontend', 'Backend'] },
    { id: 'task-5', title: 'User testing for new feature', priority: 'Medium', tags: ['Research'] },
  ],
  done: [
    { id: 'task-6', title: 'Onboarding component V1', priority: 'High', tags: ['Frontend'] },
    { id: 'task-7', title: 'Migrate database to new server', priority: 'High', tags: ['DevOps', 'Backend'] },
  ],
};

export function BoardTab() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      <KanbanColumn title="To Do">
        {tasks.todo.map(task => <TaskCard key={task.id} task={task} />)}
      </KanbanColumn>
      <KanbanColumn title="In Progress">
        {tasks.inProgress.map(task => <TaskCard key={task.id} task={task} />)}
      </KanbanColumn>
      <KanbanColumn title="Done">
        {tasks.done.map(task => <TaskCard key={task.id} task={task} />)}
      </KanbanColumn>
    </div>
  );
}
