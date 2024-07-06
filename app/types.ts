export type TaskType = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export interface ListType {
  id: number;
  title: string;
  color: string;
  tasks: TaskType[];
}

export type ColorsType = {
  id: number;
  color: string;
};
