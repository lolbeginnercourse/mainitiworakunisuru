(() => {
  const form = document.querySelector("#region-search-form");
  if (!form) return;

  const input = document.querySelector("#region-search");
  const clear = document.querySelector("#region-clear");
  const reset = document.querySelector("#region-reset");
  const filters = [...document.querySelectorAll("#region-filters [data-filter]")];
  const cards = [...document.querySelectorAll(".region-filterable")];
  const count = document.querySelector("#region-result-count");
  const empty = document.querySelector("#region-empty");
  let activeFilter = "all";

  const normalize = (value = "") => value
    .normalize("NFKC")
    .toLocaleLowerCase("ja")
    .replaceAll("・", "")
    .trim()
    .replace(/\s+/g, " ");

  const compact = (value = "") => normalize(value).replaceAll(" ", "");

  const draw = () => {
    const terms = normalize(input.value).split(" ").filter(Boolean).map(compact);
    let visible = 0;

    cards.forEach((card) => {
      const groups = (card.dataset.groups || "").split(" ");
      const haystack = compact(card.dataset.search || "");
      const filterMatches = activeFilter === "all" || groups.includes(activeFilter);
      const textMatches = terms.every(term => haystack.includes(term));
      const show = filterMatches && textMatches;
      card.hidden = !show;
      if (show) visible += 1;
    });

    count.textContent = `${cards.length}件中${visible}件を表示`;
    empty.hidden = visible !== 0;
  };

  const setFilter = (value) => {
    activeFilter = value;
    filters.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === value)));
    draw();
  };

  const resetAll = ({ focus = true } = {}) => {
    input.value = "";
    setFilter("all");
    if (focus) input.focus();
  };

  input.addEventListener("input", draw);
  form.addEventListener("submit", event => {
    event.preventDefault();
    draw();
    input.focus();
  });
  filters.forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));
  clear.addEventListener("click", () => {
    input.value = "";
    draw();
    input.focus();
  });
  reset.addEventListener("click", () => resetAll());
  draw();
})();
