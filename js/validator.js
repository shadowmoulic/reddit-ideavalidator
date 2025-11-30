// validator.js
import { getUsageCount, incrementUsage } from "./usage.js";
import { getUser } from "./auth.js";
import { showLoader, hideLoader, toast, showRemaining } from "./ui.js";

const form = document.querySelector("form");

export async function initValidator() {
  const used = await getUsageCount();
  showRemaining(used);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const usedNow = await getUsageCount();

    if (usedNow >= 3) {
      toast("You’ve used your 3 free validations. Sign up to continue!");
      window.location.href = "/pricing";
      return;
    }

    showLoader();

    try {
      const response = await fetch(form.action, {
        method:"POST",
        body:new FormData(form)
      });

      const result = await response.json();
      hideLoader();

      document.getElementById("report-container").innerHTML =
        `<div class="text-white p-6">
          ${(result.output||"").replace(/\n/g,"<br>")}
        </div>`;

      // increment count
      await incrementUsage();

      // update credits
      const updatedCount = await getUsageCount();
      showRemaining(updatedCount);

    } catch(err) {
      hideLoader();
      toast(err.message);
    }
  };
}

initValidator();


document.getElementById("share-btn").innerHTML = `
  <button id="tweet-btn" class="bg-blue-500 text-white px-4 py-2 rounded">
    Share Your Score
  </button>
`;

document.getElementById("tweet-btn").onclick = () => {
  const text = `I just validated my startup idea using IdeaValidator — Score: ${result.score}/100. Try yours!`;
  const url = encodeURI(`https://twitter.com/intent/tweet?text=${text}`);
  window.open(url, "_blank");
};
