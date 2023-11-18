import { PipelineRun } from "./pipeline-run";

export interface SimpleHandler<C extends object> {
  getConfig(): C;

  setPipelineRun(pipelineRun: PipelineRun): void;
}

export function isConfig<C extends object>(f: C | SimpleHandler<C>): f is C {
  // Naive check but works well
  return (f as any).getConfig === undefined;
}
