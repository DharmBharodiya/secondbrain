import { BACKEND_URL } from "../config/config";

export async function FetchContentService(token: string) {
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

  if (Array.isArray(data.message)) {
    const errorMessage = data.message.map((err: any) => err.message).join(", ");

    throw new Error(errorMessage);
  }

  if (!result.ok) {
    throw new Error(data.message || "Error uploading content");
  }

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

interface ShareContentProps {
  token: string;
  shareValue: boolean;
}

export async function SetSharedBrainService({
  token,
  shareValue,
}: ShareContentProps) {
  const res = await fetch(BACKEND_URL + "/brain/share", {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ share: shareValue }),
    method: "POST",
  });

  const data = await res.json();

  return data.message;
}

export async function GetSharedContent(shareId: string) {
  const res = await fetch(BACKEND_URL + `/brain/${shareId}`, {
    method: "GET",
  });

  const data = await res.json();

  console.log(data);
  return data.content;
}
