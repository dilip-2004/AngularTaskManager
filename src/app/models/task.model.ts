export interface TaskItem {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  userId: string;
}