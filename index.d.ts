declare class HeartPing {
  DEFAULT_TIMEOUT: number;
  DEFAULT_INTERVAL: number;

  interval: number;
  timeout: number;
  lastHeartbeatTime: number;
  timer: NodeJS.Timer | undefined;
  timeoutTimer: NodeJS.Timer | undefined;
  timeoutFn: () => void;

  constructor();
  getBeatInterval(): number;
  setBeatInterval(newInterval: number): void;
  getBeatTimeout(): number;
  setBeatTimeout(newTimeout: number): void;
  hasTimedOut(): boolean;
  setOnTimeout(fn: () => void): void;
  isBeating(): boolean;
  stop(): void;
  start(
    url: string,
    port: number,
    successFn: (time: number) => void,
    failedFn: () => void
  ): void;
  reset(): void;
  ping(url: string, port?: number): Promise<number>;
}

export = HeartPing;
