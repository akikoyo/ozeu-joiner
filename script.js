document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const tokens = document.getElementById("tokens").value.trim().split(/[\n, ]+/).filter(Boolean);
  const inviteRaw = document.getElementById("invite").value.trim();
  const logEl = document.getElementById("log");

  if (!inviteRaw) {
    logEl.textContent = "❌ 招待リンクを入力してください。";
    return;
  }

  // 招待コード抽出（どの形式でもOK）
  const invite = inviteRaw
    .replace(/^https?:\/\//, "")
    .replace(/^discord\.gg\//, "")
    .replace(/^www\.discord\.gg\//, "")
    .replace(/^\.?gg\//, "")
    .split(/[\/\?\&]/)[0];

  if (!invite) {
    logEl.textContent = "❌ 招待コードの抽出に失敗しました。";
    return;
  }

  logEl.textContent = `実行中...\n対象コード: ${invite}\n`;

  for (const token of tokens) {
    const session_id = crypto.randomUUID();

    try {
      const res = await fetch("https://joiner.nnnnnnnnnnnnnnnn.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, invite, session_id })
      });

      const text = await res.text();
      if (res.status === 404 || /Unknown Invite/i.test(text)) {
        logEl.textContent += `❌ 無効な招待リンクです → ${invite}\n`;
        break;
      }

      logEl.textContent += `[${res.status}] ${token.slice(0, 10)}... → ${text}\n`;
    } catch (e) {
      logEl.textContent += `⚠️ ERROR ${token.slice(0, 10)}... → ${e.message}\n`;
    }
  }
});
