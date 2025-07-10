document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.querySelector("input[name='ele1']");
  const listBox = document.querySelector(".box:last-child");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop default reload

    const item = input.value;
    if (!item.trim()) return;

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ ele1: item })
      });

      if (res.ok) {
        // Add item to DOM
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
          <input type="checkbox">
          <p>${item}</p>
        `;
        listBox.insertBefore(div, form);
        input.value = "";
      } else {
        console.error("Failed to add item");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  });
});
