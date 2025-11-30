// billing.js
import client from "./supabase.js";
import { ensureLoggedIn } from "./auth.js";

export function initBilling() {
  document.getElementById("lifetime-btn")?.addEventListener("click", lifetime);
  document.getElementById("monthly-btn")?.addEventListener("click", monthly);
}

async function lifetime(e) {
  e.preventDefault();
  const user = await ensureLoggedIn();

  var options = {
    key: "rzp_test_RlnD7zEcwhnDDK",
    amount: 27300,
    currency: "INR",
    name: "IdeaValidator - Lifetime",
    handler: async function (resp) {
      await client.from("purchases").insert([{
        email:user.email,
        plan:"lifetime",
        razorpay_payment_id: resp.razorpay_payment_id
      }]);
      window.location.href = "/";
    }
  };

  new Razorpay(options).open();
}

async function monthly(e) {
  e.preventDefault();
  const user = await ensureLoggedIn();

  var options = {
    key: "rzp_test_RlnD7zEcwhnDDK",
    subscription_id:"sub_RlnSI90diK815g",
    name:"IdeaValidator - Monthly",
    handler: async function(resp) {
      await client.from("purchases").insert([{
        email:user.email,
        plan:"monthly",
        razorpay_subscription_id: resp.razorpay_subscription_id,
        status:"active"
      }]);
      window.location.href = "/";
    }
  };

  new Razorpay(options).open();
}
