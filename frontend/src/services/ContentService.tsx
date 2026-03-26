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

interface UploadContentProps {
  token: string;
  title: string;
  link: string;
  type: string;
  notes: string;
  separatedTags: string[];
}

export async function UploadContentService({
  token,
  title,
  link,
  type,
  notes,
  separatedTags,
}: UploadContentProps) {
  const result = await fetch(BACKEND_URL + "/content", {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, type, notes, tags: separatedTags, link }),
    method: "POST",
  });

  const data = await result.json();

  return data.message;
}

interface DeleteContentProps {
  token: string;
  contentId: string;
}

export async function DeleteContentService({
  token,
  contentId,
}: DeleteContentProps) {
  const result = await fetch(BACKEND_URL + `/content/${contentId}`, {
    headers: {
      Authorization: token,
    },
    method: "DELETE",
  });

  const data = await result.json();
  return data.message;
}
