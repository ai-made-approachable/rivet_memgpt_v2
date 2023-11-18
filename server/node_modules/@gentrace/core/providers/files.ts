import { globalGentraceApi } from "./init";
import { File } from "@web-std/file";

export async function uploadBuffer(
  fileName: string,
  buffer: Buffer,
  options?: undefined | FilePropertyBag,
): Promise<string> {
  return await uploadFile(
    new File(
      [buffer],
      fileName,
      options ?? {
        type: "application/octet-stream",
        lastModified: Date.now(),
      },
    ),
  );
}

export async function uploadFile(file: File): Promise<string> {
  if (!globalGentraceApi) {
    throw new Error("Gentrace API key not initialized. Call init() first.");
  }

  const response = await globalGentraceApi.v1FilesUploadPost(undefined, file);
  return response.data.url;
}
