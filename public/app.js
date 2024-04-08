document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;

    remove(id).then(() => {
      event.target.closest("tr").remove();
    });
  }
});

async function remove(id) {
  await fetch(`/appointment/${id}`, { method: "DELETE" });
}
