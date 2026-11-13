/* Runs the tracer off the main thread. The picture is sent once and kept here, so changing
   settings, merging colors or making a color transparent re-traces without sending it again,
   and the color analysis is reused when only the tracing settings change. */
importScripts("/assets/js/vectorize.js");
let session = null, sessionId = null;
self.onmessage = function (e) {
  const msg = e.data;
  if (msg.type === "image") {
    session = self.Revector.createSession(msg.image);
    sessionId = msg.imageId;
    return;
  }
  if (msg.type === "trace") {
    const { id, imageId, options } = msg;
    if (!session || sessionId !== imageId) { self.postMessage({ id, type: "error", message: "no-image" }); return; }
    try {
      let last = 0;
      const result = session.trace(options, function (p, text) {
        const now = Date.now();
        if (now - last < 80 && p !== 1) return;
        last = now;
        self.postMessage({ id, type: "progress", p, text });
      });
      self.postMessage({ id, type: "done", result });
    } catch (err) {
      self.postMessage({ id, type: "error", message: String((err && err.message) || err) });
    }
  }
};
