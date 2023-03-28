export async function handleTest(data: any, cb: (result: any) => void) {
  const res = await new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("OK!!!");
    }, 500);
  });

  return cb(res);
}
