/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = 'in progress' | 'done' | 'stuck';

export interface Task {
  id: string;
  name: string;
  date: string;
  status: TaskStatus;
}

export interface Resource {
  id: string;
  name: string;
  tasks: Task[];
  color?: string;
}

export interface Lead {
  id: string;
  name: string;
  role: string;
  team: string;
  scope: string;
  resources: Resource[];
  isAdmin?: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'user';
  name: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  isAdmin: boolean;
}
