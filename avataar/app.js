// app.js
async function showAvatar() {
  // 1) local JSON (relative to index.html)
  const res = await fetch("./article/promise-chaining/user.json");
  if (!res.ok) throw new Error("Local JSON HTTP " + res.status);
  const user = await res.json();

  // 2) GitHub user
  const ghRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(user.name)}`
  );
  if (!ghRes.ok) throw new Error("GitHub HTTP " + ghRes.status);
  const ghUser = await ghRes.json();

  // 3) show avatar for 3s
  const img = document.createElement("img");
  img.src = ghUser.avatar_url;
  img.style.width = "150px";
  document.body.append(img);

  await new Promise((r) => setTimeout(r, 3000));
  img.remove();

  return ghUser;
}

showAvatar();
