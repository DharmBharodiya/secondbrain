export function generateHash(length: number) {
  const options =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678910";

  let hash = "";

  for (let i = 0; i < length; i++) {
    hash += Math.floor(Math.random() * length);
  }

  return hash;
}
