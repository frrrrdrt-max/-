
export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export interface OrnamentData {
  id: number;
  type: 'ball' | 'gift' | 'light';
  chaosPos: [number, number, number];
  targetPos: [number, number, number];
  color: string;
  weight: number;
}
