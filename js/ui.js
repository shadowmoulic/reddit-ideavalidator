// ui.js
export function showLoader() {
  document.getElementById("loading-spinner")?.classList.remove("hidden");
}
export function hideLoader() {
  document.getElementById("loading-spinner")?.classList.add("hidden");
}

export function toast(msg) {
  alert(msg);
}

export function showRemaining(count) {
  const remaining = 3 - count;
  document.getElementById("credits-bar").innerHTML = `
    <div class="bg-primary p-2 rounded text-white text-center">
      ${remaining} free validations left
    </div>
  `;
}



  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('bg-background-dark/90', 'shadow-primary/30');
    } else {
      header.classList.remove('bg-background-dark/90', 'shadow-primary/30');
    }
  });
