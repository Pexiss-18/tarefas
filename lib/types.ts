export type Task = {
  id: string;
  title: string;
  done: boolean;
  /** Dia a que a tarefa pertence, no formato YYYY-MM-DD. */
  date: string;
  createdAt: string;
};

export type DB = {
  tasks: Task[];
};
