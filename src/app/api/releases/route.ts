import { listAllB2Files, isPlaceholderKey } from "@/lib/b2-storage";
import { classifyFile } from "@/lib/b2-classify";

// Route Handler ở Next 16 KHÔNG cache mặc định (xem
// node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md)
// nên không cần export const dynamic = "force-dynamic".

export type ReleaseFile = {
  fileName: string;
  contentLength: number;
  contentType: string;
  uploadTimestamp: number;
  os: string | null;
  linuxFormat: string;
  label: string | null;
};

export async function GET() {
  try {
    const files = await listAllB2Files();

    const releases: ReleaseFile[] = files
      .filter((file) => !isPlaceholderKey(file.fileName))
      .map((file) => {
        const cls = classifyFile(file.fileName);

        return {
          fileName: file.fileName,
          contentLength: file.contentLength,
          contentType: file.contentType,
          uploadTimestamp: file.uploadTimestamp,
          os: cls.os,
          linuxFormat: cls.linuxFormat,
          label: cls.label,
        };
      })
      // Mới nhất lên đầu.
      .sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);

    // Cố ý KHÔNG trả fileId: đó là định danh dùng để xóa file trên B2
    // (xem deleteB2File trong admin), không được lộ ra public.
    return Response.json({ releases });
  } catch (error) {
    console.error("[api/releases]", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không đọc được danh sách file trên B2",
      },
      { status: 500 }
    );
  }
}
