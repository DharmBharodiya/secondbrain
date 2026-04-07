import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LoginService,
  SignupService,
  UserFetchService,
} from "../services/AuthService";
import {
  DeleteContentService,
  FetchContentService,
  GetSharedContent,
  GetStarredContent,
  SetSharedBrainService,
  StarContent,
  UpdateContentService,
  UpdateUsername,
  UploadContentService,
} from "../services/ContentService";

//hook for fetching user information
export const useFetchUser = (token: string) => {
  return useQuery({
    queryKey: ["user", token],
    queryFn: () => UserFetchService(token),
    enabled: !!token, //only run if token exists
  });
};

type LoginProps = {
  username: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (params: LoginProps) => LoginService(params),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (params: LoginProps) => SignupService(params),
  });
};

export const useFetchStarredContent = (token: string) => {
  return useQuery({
    queryKey: ["starredContent", token],
    queryFn: () => GetStarredContent(token),
    enabled: !!token,
  });
};

export const useFetchUserContent = (token: string) => {
  return useQuery({
    queryKey: ["userContent", token],
    queryFn: () => FetchContentService(token),
    enabled: !!token,
  });
};

interface UploadContentProps {
  token: string;
  formData: FormData;
}

export const useUploadNewContent = () => {
  return useMutation({
    mutationFn: (params: UploadContentProps) => UploadContentService(params),
  });
};

interface UpdateContentProps {
  title?: string;
  link?: string;
  type?: string;
  notes?: string;
  tags?: string[];
}

interface UpdateContentParams {
  contentId: string;
  token: string;
  data: UpdateContentProps;
}

export const useUpdateContent = () => {
  return useMutation({
    mutationFn: (params: UpdateContentParams) =>
      UpdateContentService(params.contentId, params.token, params.data),
  });
};

interface DeleteContentProps {
  token: string;
  contentId: string;
}

export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteContentProps) => DeleteContentService(params),
    onSuccess: () => {
      // Invalidate queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ["userContent"] });
      queryClient.invalidateQueries({ queryKey: ["starredContent"] });
    },
  });
};

type StarContent = {
  contentId: string;
  token: string;
};

export const useStarContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: StarContent) =>
      StarContent(params.contentId, params.token),

    onSuccess: () => {
      // Invalidate queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ["userContent"] });
      queryClient.invalidateQueries({ queryKey: ["starredContent"] });
    },
  });
};

type UsernameUpdate = {
  newUsername: string;
  token: string;
};

export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UsernameUpdate) =>
      UpdateUsername(params.newUsername, params.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userContent"] });
      queryClient.invalidateQueries({ queryKey: ["starredContent"] });
    },
  });
};

export const useShareBoard = (shareId: string | undefined) => {
  return useQuery({
    queryKey: ["sharedContent", shareId],
    queryFn: () => GetSharedContent(shareId),
  });
};

interface ShareContentProps {
  token: string;
  shareValue: boolean;
}

export const useSetSharedBoard = () => {
  return useMutation({
    mutationFn: (params: ShareContentProps) => SetSharedBrainService(params),
  });
};
