"use client";

// Catches errors in the root layout itself. Must render its own <html>/<body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0a0c", color: "#fafafa", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ fontSize: "14px", color: "#a1a1aa", marginTop: "8px", maxWidth: "440px" }}>
            A critical error occurred while loading the app. Please try again.
          </p>
          {error?.digest && <p style={{ fontSize: "11px", color: "#71717a", marginTop: "8px", fontFamily: "monospace" }}>ref: {error.digest}</p>}
          <button
            onClick={reset}
            style={{ marginTop: "28px", padding: "12px 24px", borderRadius: "9999px", border: "none", background: "#8b5cf6", color: "#fff", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
