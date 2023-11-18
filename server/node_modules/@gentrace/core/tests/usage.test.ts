import { init, Pipeline } from "../providers";
import { resetGlobalGentraceApi } from "../providers/init";

describe("Usage of OpenAIApi", () => {
  const OLD_ENV = process.env;

  afterAll(() => {
    process.env = OLD_ENV;
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
    resetGlobalGentraceApi();
  });

  describe("constructor", () => {
    it("should not throw if API key is specified by the env variable", () => {
      process.env.GENTRACE_API_KEY = "some-test-api-key";
      expect(() => {
        init();
      }).not.toThrow();
    });

    it("should not throw if API key is specified by the env variable (empty object)", () => {
      process.env.GENTRACE_API_KEY = "some-test-api-key";
      expect(() => {
        init({});
      }).not.toThrow();
    });

    it("should throw if API key is not specified by the env variable and not provided in the constructor", () => {
      expect(() => {
        init();
      }).toThrow();
    });

    it("should throw if init() is not called before pipeline", () => {
      expect(() => {
        const pipeline = new Pipeline({
          id: "test-id",
        });
      }).toThrow();
    });
  });
});
