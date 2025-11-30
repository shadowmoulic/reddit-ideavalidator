// auth.js
import client from "./supabase.js";

export async function getUser() {
  const { data } = await client.auth.getUser();
  return data.user;
}

export async function logout() {
  await client.auth.signOut();
  window.location.reload();
}

export async function ensureLoggedIn() {
  const user = await getUser();
  if (!user) {
    window.location.href = "/signup.html";
  }
  return user;
}
