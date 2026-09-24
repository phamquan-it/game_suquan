import { getB2 } from "@/lib/b2";
import {
  B2_BUCKET_ID,
  B2_BUCKET_NAME,
  B2_DOWNLOAD_HOST,
  listAllB2Files,
} from "@/lib/b2-storage";

/**
 * Thời hạn token tải. Trước đây 60 giây — quá ngắn nếu người chơi bấm tải rồi
 * để tab đó một lúc, hoặc mạng chậm. 1 giờ đủ thoải mái mà vẫn không phải link
 * vĩnh viễn.
 *
 * LƯU Ý BẢO MẬT: token sống càng lâu thì link càng dễ bị copy đi share. Vì
 * vậy route này phải kiểm tra key có thật trên bucket (bên dưới) để không ai
 * dùng nó làm công cụ dò tên file, và phải rate limit để không ai spam lấy
 * token hàng loạt.
 */
const TOKEN_TTL_SECONDS = 3600;

/** Cache danh sách file để mỗi lượt tải không phải gọi B2 hai lần. */
let cachedKeys: { keys: Set<string>; expiresAt: number } | null = null;
const KEY_CACHE_TTL_MS = 5 * 60 * 1000;

async function getValidKeys(): Promise<Set<string>> {
  const now = Date.now();

  if (cachedKeys && cachedKeys.expiresAt > now) {
    return cachedKeys.keys;
  }

  const files = await listAllB2Files();
  const keys = new Set(files.map((f) => f.fileName));

  cachedKeys = { keys, expiresAt: now + KEY_CACHE_TTL_MS };

  return keys;
}

/**
 * Rate limit theo IP, in-memory.
 *
 * Đủ cho một instance. Nếu deploy nhiều instance hoặc serverless nhiều region
 * thì Map này KHÔNG dùng chung được giữa các instance — lúc đó phải chuyển
 * sang Redis/Upstash. Ghi rõ ở đây để không ai tưởng nó chặt hơn thực tế.
 */
const hits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;

  // Dọn entry cũ để Map không phình vô hạn.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.resetAt <= now) hits.delete(k);
    }
  }

  return entry.count > RATE_LIMIT;
}

export async function GET(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Quá nhiều yêu cầu, vui lòng thử lại sau" },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return Response.json({ error: "Missing file key" }, { status: 400 });
  }

  // Chặn traversal và key rỗng bất thường trước khi chạm tới B2.
  if (key.startsWith("/") || key.includes("..") || key.includes("//")) {
    return Response.json({ error: "Invalid file key" }, { status: 400 });
  }

  // Chỉ cấp token cho file CÓ THẬT trên bucket. Không có bước này thì route
  // trở thành công cụ dò tên file: getDownloadAuthorization cấp token theo
  // PREFIX, nên key="releases/" sẽ mở được mọi file trong thư mục đó.
  const validKeys = await getValidKeys();

  if (!validKeys.has(key)) {
    return Response.json({ error: "File không tồn tại" }, { status: 404 });
  }

  const b2 = await getB2();

  const auth = await b2.getDownloadAuthorization({
    bucketId: B2_BUCKET_ID,
    fileNamePrefix: key,
    validDurationInSeconds: TOKEN_TTL_SECONDS,
  });

  // encodeURIComponent mã hóa luôn dấu "/" thành "%2F". Key nằm trong thư mục
  // con (vd "releases/linux/game_12_suquan-linux-x64.deb") sẽ biến thành một
  // segment duy nhất và B2 trả 404. Encode từng segment, giữ nguyên "/".
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const url = `${B2_DOWNLOAD_HOST}/file/${B2_BUCKET_NAME}/${encodedKey}?Authorization=${auth.data.authorizationToken}`;

  return Response.json({ url });
}
