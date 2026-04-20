export interface Workspace {
  id: number;
  name: string;
  monitor: string;
  windows: number;
  lastwindowtitle: string;
}

export interface Client {
  address: string;
  class: string;
  title: string;
  pid: number;
}
