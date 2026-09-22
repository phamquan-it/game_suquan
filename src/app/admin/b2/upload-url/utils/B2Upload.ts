import { createHash } from "crypto";
import { readFile } from "fs/promises";

export interface B2AuthorizeResult {
  accountId: string;
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
}

export interface B2UploadUrlResult {
  authorizationToken: string;
  bucketId: string;
  uploadUrl: string;
}

export interface B2UploadFileResult {
  accountId: string;
  bucketId: string;
  fileId: string;
  fileName: string;
  contentType: string;
  contentLength: number;
  contentSha1: string;
  uploadTimestamp: number;
  fileInfo: Record<string, string>;
  [key: string]: unknown;
}

export interface B2UploadOptions {
  filePath: string;
  fileName: string;
  contentType?: string;
}

export class B2Upload {
  private readonly keyId: string;
  private readonly applicationKey: string;
  private readonly bucketId: string;

  constructor() {
    const keyId = process.env.B2_KEY_ID;
    const applicationKey = process.env.B2_APPLICATION_KEY;
    const bucketId = "7c05de4a5db3e2bc97d00418";

    if (!keyId) {
      throw new Error("Thiếu biến môi trường B2_KEY_ID");
    }

    if (!applicationKey) {
      throw new Error("Thiếu biến môi trường B2_APPLICATION_KEY");
    }

    if (!bucketId) {
      throw new Error("Thiếu biến môi trường B2_BUCKET_ID");
    }

    this.keyId = keyId;
    this.applicationKey = applicationKey;
    this.bucketId = bucketId;
  }

  /**
   * Bước 1:
   * b2_authorize_account
   */
  async authorize(): Promise<B2AuthorizeResult> {
    const credentials = Buffer.from(
      `${this.keyId}:${this.applicationKey}`,
    ).toString("base64");

    const response = await fetch(
      "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    const data = await this.parseResponse(response);

    return {
      accountId: data.accountId,
      authorizationToken: data.authorizationToken,
      apiUrl: data.apiInfo.storageApi.apiUrl,
      downloadUrl: data.apiInfo.storageApi.downloadUrl,
    };
  }

  /**
   * Bước 2:
   * b2_get_upload_url
   */
  async getUploadUrl(
    authorize: B2AuthorizeResult,
  ): Promise<B2UploadUrlResult> {
    const response = await fetch(
      `${authorize.apiUrl}/b2api/v3/b2_get_upload_url`,
      {
        method: "POST",
        headers: {
          Authorization: authorize.authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketId: this.bucketId,
        }),
      },
    );

    const data = await this.parseResponse(response);

    return {
      authorizationToken: data.authorizationToken,
      bucketId: "7c05de4a5db3e2bc97d00418",
      uploadUrl: data.uploadUrl,
    };
  }

  /**
   * Bước 3:
   * b2_upload_file
   */
  async uploadFile(
    uploadUrl: B2UploadUrlResult,
    options: B2UploadOptions,
  ): Promise<B2UploadFileResult> {
    const fileBuffer = await readFile(options.filePath);

    // lib.dom.d.ts định nghĩa BufferSource = ArrayBufferView<ArrayBuffer> | ArrayBuffer,
    // tức là đòi ĐÚNG ArrayBuffer, trong khi @types/node khai Buffer.buffer là
    // ArrayBufferLike. Cắt về Uint8Array<ArrayBuffer> để TypeScript chấp nhận mà
    // không copy dữ liệu (vẫn trỏ vào cùng vùng nhớ).
    const body = new Uint8Array(
      fileBuffer.buffer as ArrayBuffer,
      fileBuffer.byteOffset,
      fileBuffer.byteLength,
    );

    const sha1 = createHash("sha1")
      .update(fileBuffer)
      .digest("hex");

    const contentType =
      options.contentType ?? "b2/x-auto";

    const response = await fetch(uploadUrl.uploadUrl, {
      method: "POST",

      headers: {
        Authorization: uploadUrl.authorizationToken,

        "X-Bz-File-Name": encodeURIComponent(options.fileName),

        "Content-Type": contentType,

        "Content-Length": fileBuffer.length.toString(),

        "X-Bz-Content-Sha1": sha1,
      },

      body,
    });

    const data = await this.parseResponse(response);

    return data as B2UploadFileResult;
  }

  /**
   * Chạy toàn bộ flow tuần tự:
   *
   * authorize
   *     ↓
   * getUploadUrl
   *     ↓
   * uploadFile
   */
  async upload(
    options: B2UploadOptions,
  ): Promise<B2UploadFileResult> {
    console.log("[B2] 1/3 authorize...");

    const authorize = await this.authorize();

    console.log("[B2] Authorized");

    console.log("[B2] 2/3 get upload URL...");

    const uploadUrl = await this.getUploadUrl(authorize);

    console.log("[B2] Upload URL:", uploadUrl.uploadUrl);

    console.log("[B2] 3/3 upload file...");
    console.log("[B2] File:", options.filePath);
    console.log("[B2] B2 key:", options.fileName);

    const result = await this.uploadFile(
      uploadUrl,
      options,
    );

    console.log("[B2] Upload completed");
    console.log("[B2] File ID:", result.fileId);

    return result;
  }

  private async parseResponse(
    response: Response,
  ): Promise<any> {
    const text = await response.text();

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `B2 trả về response không hợp lệ (${response.status}): ${text}`,
      );
    }

    if (!response.ok) {
      throw new Error(
        `B2 API error ${response.status}: ${
          data.message ?? JSON.stringify(data)
        }`,
      );
    }

    return data;
  }
}

