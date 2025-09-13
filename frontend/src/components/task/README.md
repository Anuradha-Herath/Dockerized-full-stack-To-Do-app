# Task Components

This folder contains all components related to task management and display.

## Components

### TaskCard.jsx
The main task card component that displays individual tasks with all their information and actions.

### TaskMenu.jsx
Dropdown menu component for task actions (Edit, Move to, Delete).

### DatePickerModal.jsx
Modal component for selecting/changing task due dates.

### PriorityModal.jsx
Modal component for setting/changing task priority levels.

### TaskMeta.jsx
Component that displays task metadata (category, due date, priority, created date).

### SubtaskProgress.jsx
Component that shows progress bar for subtasks within a task.

### index.js
Barrel export file for clean imports from this folder.

## Usage

```javascript
// Import individual components
import TaskCard from './components/task/TaskCard';

// Or import from barrel export
import { TaskCard, TaskMenu } from './components/task';
```
