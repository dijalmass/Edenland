export interface AudioStatus {
  volume: number;
  mute: boolean;
  default_sink: string;
}

export interface AudioSink {
  index: number;
  name: string;
  description: string;
  volume: number;
  mute: boolean;
  is_default: boolean;
}

export interface AudioApp {
  index: number;
  name: string;
  volume: number;
  mute: boolean;
}
