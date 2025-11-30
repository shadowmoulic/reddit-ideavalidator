import { supabaseClient } from "./supabase.js";

export async function getUsage() {
  const { data: auth } = await supabaseClient.auth.getUser();
  if (!auth.user) return null;

  const email = auth.user.email;

  let { data: usage } = await supabaseClient
    .from("usage")
    .select("*")
    .eq("email", email)
    .single();

  // Create new usage row if missing
  if (!usage) {
    usage = {
      email,
      count: 0,
      reset_at: new Date(Date.now() + 7 * 86400000) // weekly reset
    };

    await supabaseClient.from("usage").insert(usage);
  }

  return usage;
}

export async function incrementUsage() {
  const { data: auth } = await supabaseClient.auth.getUser();
  const email = auth.user.email;

  const usage = await getUsage();

  await supabaseClient
    .from("usage")
    .update({ count: usage.count + 1 })
    .eq("email", email);
}

export function renderUsageBar(count) {
  const remaining = 3 - count;

  document.getElementById("usage-bar")?.remove();

  const bar = document.createElement("p");
  bar.id = "usage-bar";
  bar.className = "text-center text-primary text-sm mb-3";
  bar.innerHTML = `${remaining} free validations left this week`;

  const form = document.getElementById("idea-form");
  form.insertAdjacentElement("beforebegin", bar);
}
