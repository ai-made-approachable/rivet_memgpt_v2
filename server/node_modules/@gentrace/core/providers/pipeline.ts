import { Configuration } from "../configuration";
import { Context, PluginContext } from "./context";
import { globalGentraceConfig } from "./init";
import { PipelineRun } from "./pipeline-run";
import { GentracePlugin } from "./plugin";

export class Pipeline<T extends { [key: string]: GentracePlugin<any, any> }> {
  public id: string;
  public slug: string;
  public config: Configuration;
  public plugins: T;

  constructor({
    slug,
    id,
    apiKey,
    basePath,
    logger,
    plugins,
  }: {
    slug?: string;

    /**
     * @deprecated Use the "slug" parameter instead
     */
    id?: string;

    /**
     * @deprecated Declare the API key in the init() call instead.
     */
    apiKey?:
      | string
      | Promise<string>
      | ((name: string) => string)
      | ((name: string) => Promise<string>);
    /**
     * @deprecated Declare the base path in the init() call instead.
     */
    basePath?: string;
    logger?: {
      info: (message: string, context?: any) => void;
      warn: (message: string | Error, context?: any) => void;
    };
    plugins?: T;
  }) {
    this.id = id;
    this.slug = slug;
    this.plugins = plugins;

    if (!slug && !id) {
      throw new Error("Please provide the Pipeline slug");
    }

    if (!globalGentraceConfig) {
      throw new Error("Please call init() before instantiating a Pipeline");
    }

    if (apiKey) {
      if (logger) {
        logger.warn(
          "The apiKey parameter is deprecated. Please declare the API key in the init() call instead.",
        );
      }
      this.config = new Configuration({
        apiKey,
        basePath,
        logger,
      });
    } else {
      this.config = globalGentraceConfig;
    }
  }

  getLogger() {
    return this.config.logger;
  }

  logInfo(message: string) {
    const logger = this.getLogger();
    if (logger) {
      logger.info(message);
    }
  }

  logWarn(e: Error | string) {
    const logger = this.getLogger();
    if (logger) {
      logger.warn(e);
    } else {
      // By default, we print to STDERR.
      console.warn(e);
    }
  }

  start(
    context?: PluginContext,
  ): PipelineRun & { [key in keyof T]: ReturnType<T[key]["advanced"]> } {
    const newPipelineRun = new PipelineRun({ pipeline: this, context });
    const argList = Object.entries(this.plugins ?? {});
    const argMap = Object.fromEntries(
      argList.map(([k, v]) => [
        k,
        v.advanced({
          pipeline: this,
          pipelineRun: newPipelineRun,
          gentraceConfig: this.config,
        }),
      ]),
    );

    return Object.assign(newPipelineRun, argMap) as PipelineRun & {
      [key in keyof T]: ReturnType<T[key]["advanced"]>;
    };
  }
}
