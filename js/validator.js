import { supabaseClient } from "./supabase.js";
import { getUsage, incrementUsage, renderUsageBar } from "./usage.js";

const webhook = "https://uwx9zm0i.rpcl.app/webhook/7d6cd815-f2b1-4ccd-bb8e-75bd2ef90ea6";

export function initValidator() {
  const form = document.getElementById("idea-form");
  const spinner = document.getElementById("loading-spinner");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1) Check login
    const { data: auth } = await supabaseClient.auth.getUser();
    if (!auth.user) {
      alert("Please sign in first.");
      window.location.href = "/signup.html";
      return;
    }

    // 2) Usage check
    const usage = await getUsage();
    if (usage.count >= 3) {
      alert("You used all free validations. Upgrade on Pricing page.");
      window.location.href = "/pricing";
      return;
    }

    renderUsageBar(usage.count);

    // 3) Webhook call
    spinner.classList.remove("hidden");
    const formData = new FormData(form);

    try {
      const res = await fetch(webhook, {
        method: "POST",
        body: formData
      });

      const output = await res.json();
      spinner.classList.add("hidden");

      // 4) Update usage
      await incrementUsage();

      // 5) Show output
      document.getElementById("report-container").innerHTML = `
        <div class="bg-surface-dark border border-border-dark p-6 rounded-xl text-white">
          ${output.content?.replace(/\n/g, "<br>") || output.output || ""}
        </div>
      `;

      // 6) Share button
      const share = document.createElement("button");
      share.className = "mt-4 bg-primary text-white rounded px-4 py-2";
      share.innerText = "Share Your Idea Score";

      share.onclick = () => {
        navigator.share({
          text: "My startup idea score on IdeaValidator!",
          url: window.location.href
        });
      };

      document.getElementById("report-container").appendChild(share);

      // 7) Update usage bar after increment
      renderUsageBar(usage.count + 1);

    } catch (err) {
      spinner.classList.add("hidden");
      alert("Error: " + err.message);
    }
  });
}
