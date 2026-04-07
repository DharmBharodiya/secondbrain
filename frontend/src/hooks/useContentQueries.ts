import { useQuery, useMutation } from "@tanstack/react-query";
import {
  LoginService,
  SignupService,
  UserFetchService,
} from "../services/AuthService";
import {
  FetchContentService,
  GetStarredContent,
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
