import globalAxios, { AxiosInstance } from "axios";
import fetchAdapter from "./adapters/fetch";

let axiosWithOptionalFetch: AxiosInstance;

function isFetchDefined(): boolean {
  return typeof fetch !== "undefined";
}

if (isFetchDefined()) {
  axiosWithOptionalFetch = globalAxios.create({
    // @ts-ignore
    adapter: fetchAdapter,
  });
} else {
  axiosWithOptionalFetch = globalAxios;
}

export default axiosWithOptionalFetch;
