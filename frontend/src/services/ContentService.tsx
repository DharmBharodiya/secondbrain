import { BACKEND_URL } from "../config/config";

export async function FetchContentService(token) {
  const result = await fetch(BACKEND_URL + "/content", {
    headers: {
      Authorization: token,
    },
    method: "GET",
  });

  const data = await result.json();

  console.log(data);
  return data.contents;
}
