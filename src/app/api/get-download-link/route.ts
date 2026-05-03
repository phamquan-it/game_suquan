import { getB2 } from "@/lib/b2";

export async function GET(req: Request) {
  // auth user của app ở đây

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return Response.json(
      { error: "Missing file key" },
      { status: 400 }
    );
  }

  const b2 = await getB2();

  const auth = await b2.getDownloadAuthorization({
    bucketId: "7c05de4a5db3e2bc97d00418",
    fileNamePrefix: key,
    validDurationInSeconds: 60,
  });

  const bucketName = "12suquan";

  const url =
    `https://f005.backblazeb2.com/file/${bucketName}/${encodeURIComponent(
      key
    )}?Authorization=${auth.data.authorizationToken}`;

  return Response.json({ url });
}
