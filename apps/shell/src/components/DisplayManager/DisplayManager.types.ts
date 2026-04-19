export interface Monitor {
  id: number;
  name: string;
  description: string;
  width: number;
  height: number;
  refreshRate: number;
  x: number;
  y: number;
  scale: number;
  focused: boolean;
  disabled: boolean;
  availableModes: string[];
}

export interface Workspace {
  id: number;
  name: string;
  monitor: string;
}

export interface DisplayState {
  brightness: number;
  monitors: Monitor[];
  workspaces: Workspace[];
  isLoading: boolean;
}
