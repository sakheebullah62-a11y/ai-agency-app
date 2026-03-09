window.addEventListener('DOMContentLoaded', (event) => {

    const WORKER_BATCH_URL = "https://seo-ai-worker1.sakheebullah62.workers.dev/batch"; 

    const runBtn = document.getElementById("run");
    const out = document.getElementById("out");

    if (runBtn) {
        runBtn.addEventListener("click", async () => {
            // ... baqi sara purana code yahan ...
            const service = document.getElementById("service").value.trim() || "SEO & Web Services";
            const audience = document.getElementById("audience").value.trim() || "global audience";
            const saveToSheet = document.getElementById("save").checked;

            const lines = document.getElementById("keywords").value
                .split("\n")
                .map(s => s.trim())
                .filter(Boolean)
                .slice(0, 3);

            if (!lines.length) {
                out.textContent = "Please enter at least 1 keyword.";
                return;
            }

            out.textContent = "Generating... please wait (10–30 seconds).";

            try {
                const resp = await fetch(WORKER_BATCH_URL, {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({
                        service, audience, type: "blog", saveToSheet,
                        items: lines.map(keyword => ({ keyword }))
                    })
                });

                const data = await resp.json();
                if (!resp.ok || !data.ok) throw new Error(data.error || "Request failed");

                out.textContent = data.results
                    .map((r, i) => `===== BLOG ${i+1}: ${r.keyword} =====\n\n${r.content}\n\n`)
                    .join("\n");

            } catch (e) {
                out.textContent = "Error: " + e.message;
            }
        });
    }
});
