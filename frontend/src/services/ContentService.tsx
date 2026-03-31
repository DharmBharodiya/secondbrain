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
  formData: FormData;
}

export async function UploadContentService({
  token,
  formData,
}: UploadContentProps) {
  const result = await fetch(BACKEND_URL + "/content", {
    headers: {
      Authorization: token,
    },
    body: formData,
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
  title?: string;
  link?: string;
  type?: string;
  notes?: string;
  tags?: string[];
}
export async function UpdateContentService(
  contentId: string,
  token: string,
  data: UpdateContentProps,
) {
  // Filter out empty values to avoid validation errors
  const filteredData: any = {};
  if (data.title?.trim()) filteredData.title = data.title.trim();
  if (data.link?.trim()) filteredData.link = data.link.trim();
  if (data.type?.trim()) filteredData.type = data.type.trim();
  if (data.notes?.trim()) filteredData.notes = data.notes.trim();
  if (data.tags && data.tags.length > 0) filteredData.tags = data.tags;

  console.log(
    `ContentId: ${contentId} - token ${token} - data ${JSON.stringify(filteredData)}`,
  );

  const res = await fetch(BACKEND_URL + `/content/${contentId}`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredData),
    method: "PUT",
  });

  const returnedData = await res.json();

  // Handle server errors first
  if (!res.ok) {
    throw new Error(
      returnedData.message ||
        returnedData.errors?.[0]?.message ||
        "Error updating content",
    );
  }

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

export async function StarContent(contentId: string, token: string) {
  const res = await fetch(BACKEND_URL + `/star/${contentId}`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });

  const data = await res.json();

  return data.message;
}

export async function GetStarredContent(token: string) {
  const res = await fetch(BACKEND_URL + "/star", {
    headers: {
      Authorization: token,
    },
    method: "GET",
  });

  const data = await res.json();

  const theContent = data.starredPosts.map((post: any) => post.contentId);
  return theContent;
}
