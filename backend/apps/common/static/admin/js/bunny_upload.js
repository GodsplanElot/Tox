(function () {
  const configNode = document.getElementById("bunny-upload-config");
  const input = document.getElementById("bunny-video-file");
  if (!configNode || !input) return;

  const config = JSON.parse(configNode.textContent);
  const statusNode = document.getElementById("bunny-upload-status");
  const progressBar = document.getElementById("bunny-upload-progress-bar");
  const chunkSize = 8 * 1024 * 1024;

  function setStatus(message, progress) {
    statusNode.textContent = message;
    if (typeof progress === "number") {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }

  function csrfToken() {
    return document.querySelector("input[name=csrfmiddlewaretoken]")?.value || "";
  }

  function metadata(name, type) {
    return [
      `filename ${btoa(unescape(encodeURIComponent(name)))}`,
      `filetype ${btoa(type || "application/octet-stream")}`,
    ].join(",");
  }

  async function requestSession() {
    const response = await fetch(config.sessionUrl, {
      method: "POST",
      headers: { "X-CSRFToken": csrfToken() },
      credentials: "same-origin",
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || "Could not create the Bunny upload session.");
    return payload;
  }

  async function uploadChunk(url, headers, offset, chunk) {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        ...headers,
        "Tus-Resumable": "1.0.0",
        "Upload-Offset": String(offset),
        "Content-Type": "application/offset+octet-stream",
      },
      body: chunk,
    });
    if (!response.ok) throw new Error("Bunny rejected an upload chunk.");
    return Number(response.headers.get("Upload-Offset"));
  }

  async function upload(file) {
    input.disabled = true;
    try {
      setStatus("Creating secure Bunny upload session...", 0);
      const session = await requestSession();
      const createResponse = await fetch(session.endpoint, {
        method: "POST",
        headers: {
          ...session.headers,
          "Tus-Resumable": "1.0.0",
          "Upload-Length": String(file.size),
          "Upload-Metadata": metadata(file.name, file.type),
        },
      });
      if (!createResponse.ok) throw new Error("Bunny could not start the resumable upload.");
      const location = createResponse.headers.get("Location");
      if (!location) throw new Error("Bunny did not return an upload location.");
      const uploadUrl = new URL(location, session.endpoint).toString();
      let offset = 0;

      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        let attempts = 0;
        while (true) {
          try {
            offset = await uploadChunk(uploadUrl, session.headers, offset, chunk);
            break;
          } catch (error) {
            attempts += 1;
            if (attempts >= 4) throw error;
            await new Promise((resolve) => setTimeout(resolve, attempts * 1000));
          }
        }
        setStatus(`Uploading ${Math.round((offset / file.size) * 100)}%...`, (offset / file.size) * 100);
      }
      setStatus("Upload complete. Bunny is now encoding the video...", 100);
      pollStatus();
    } catch (error) {
      setStatus(error.message || "The upload failed. Please try again.", 0);
      input.disabled = false;
    }
  }

  async function pollStatus() {
    try {
      const response = await fetch(config.statusUrl, { credentials: "same-origin" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail || "Could not read Bunny status.");
      const label = payload.status === "ready" ? "Video is ready for streaming and download." : `Bunny is encoding the video (${payload.progress}%).`;
      setStatus(label, payload.progress);
      if (payload.status !== "ready") window.setTimeout(pollStatus, 10000);
    } catch (error) {
      setStatus(error.message || "Could not refresh Bunny status.");
    }
  }

  input.addEventListener("change", () => {
    if (input.files?.[0]) upload(input.files[0]);
  });
  setStatus(config.status === "ready" ? "Video is ready for streaming and download." : "Choose a video file to upload.", config.progress || 0);
})();
