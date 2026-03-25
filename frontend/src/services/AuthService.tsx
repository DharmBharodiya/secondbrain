import { BACKEND_URL } from "../config/config";

type AuthServiceProps = {
  username: string;
  password: string;
};

export async function SignupService({ username, password }: AuthServiceProps) {
  const data = {
    username,
    password,
  };

  const res = await fetch(BACKEND_URL + "/signup", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    method: "POST",
  });

  const message = await res.json();

  return message.message;
}

export async function LoginService({ username, password }: AuthServiceProps) {
  const data = {
    username,
    password,
  };

  const res = await fetch(BACKEND_URL + "/signin", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    method: "POST",
  });

  const result = await res.json();

  return result;
}

export async function UserFetchService(token: string) {
  console.log("Token:", token);

  const result = await fetch(BACKEND_URL + "/user", {
    headers: {
      authorization: token,
    },
    method: "GET",
  });

  const data = await result.json();
  console.log("data:" + JSON.stringify(data));

  return data;
}
