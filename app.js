window.addEventListener('DOMContentLoaded', () => {
    const WORKER_BATCH_URL = "https://seo-ai-worker1.sakheebullah62.workers.dev/batch";
    const runBtn = document.getElementById("run");
    const out = document.getElementById("out");

    if (runBtn) {
        runBtn.addEventListener("click", async () => {
            const keywordsRaw = document.getElementById("keywords").value;
            const lines = keywordsRaw.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 3);

            if (!lines.length) {
                out.textContent = "Please enter at least 1 keyword.";
                return;
            }

            out.textContent = "Loki is generating content... Please wait 20-30 seconds.";

            try {
                const resp = await fetch(WORKER_BATCH_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: lines.map(k => ({ keyword: k })) })
                });

                const data = await resp.json();
                if (!resp.ok) throw new Error(data.error || "Server Error");

                out.textContent = data.results.map(r => `--- BLOG: ${r.keyword} ---\n\n${r.content}\n\n`).join("");
            } catch (e) {
                out.textContent = "Error: " + e.message;
            }
        });
    }
});

