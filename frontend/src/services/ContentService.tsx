import { BACKEND_URL } from "../config/config";

export async function FetchContentService(token: string) {
  const result = await fetch(BACKEND_URL + "/content", {
    headers: {
      Authorization: token,
    },
    method: "GET",
  });

  const data = await result.json();

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
    const errorMessage = data.message
      .map((err: { message: string }) => err.message)
      .join(", ");

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
interface UpdateContentProps {
  title: string;
  link: string;
  type: string;
  notes: string;
  tags: string[];
}
export async function UpdateContentService(
  contentId: string,
  token: string,
  data: UpdateContentProps,
) {
  const res = await fetch(BACKEND_URL + `/content/${contentId}`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    method: "PUT",
  });

  const returnedData = await res.json();

  // Handle validation errors - backend returns either "message" or "errors"
  if (Array.isArray(returnedData.message)) {
    const errorMessages = returnedData.message
      .map((err: { message: string }) => err.message)
      .join(", ");
    throw new Error(errorMessages);
  }

  // Handle validation errors in "errors" field (if backend uses that format)
  if (Array.isArray(returnedData.errors)) {
    const errorMessages = returnedData.errors
      .map((err: { message: string }) => err.message)
      .join(", ");
    throw new Error(errorMessages);
  }

  // Handle server errors
  if (!res.ok) {
    throw new Error(
      returnedData.message || returnedData.errors || "Error updating content",
    );
  }

  return returnedData.message || "Content updated successfully";
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

  return data.content;
}
