import B2 from "backblaze-b2";

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID!,
  applicationKey: process.env.B2_APPLICATION_KEY!,
});

export async function getB2() {
  await b2.authorize();
  return b2;
}
