import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SampleQueries from "./SampleQueries";

function GraphQLTester() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      let text = '';
      if (result) {
        text = JSON.stringify(result, null, 2);
      } else if (error) {
        text = typeof error === 'string' ? error : JSON.stringify(error, null, 2);
      }
      if (text) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    };
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("{ __typename }");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token && token.trim()) {
        headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#F3E8DF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "48px 0",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "80%",
          maxWidth: 900,
          height: 60,
          background: "#E8D1C5",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 32px auto",
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: 700,
            color: "#452829",
            margin: 0,
          }}
        >
          GraphQL Web Tester
        </h1>
      </div>
      {/* Centered Button */}
      <div
        style={{
          width: 220,
          margin: "0 auto 32px auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link
          to="/samples"
          style={{
            color: "#452829",
            fontWeight: 500,
            fontSize: 18,
            textDecoration: "underline",
            background: "#E8D1C5",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            textAlign: "center",
            display: "inline-block",
          }}
        >
          Xem query mẫu
        </Link>
      </div>
      {/* Two Columns */}
      <div
        style={{
          width: "90%",
          maxWidth: 1200,
          display: "flex",
          flexDirection: "row",
          gap: 48,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Left: Query Input */}
        <div
          style={{
            width: 480,
            height: 800,
            background: "#E8D1C5",
            borderRadius: 12,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "stretch",
            boxSizing: "border-box",
          }}
        >
          <input
            type="text"
            style={{
              height: 36,
              fontSize: 16,
              borderRadius: 6,
              border: "none",
              padding: "0 12px",
              background: "#F3E8DF",
              color: "#452829",
              marginBottom: 8,
            }}
            placeholder="GraphQL Server URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            type="password"
            style={{
              height: 36,
              fontSize: 16,
              borderRadius: 6,
              border: "none",
              padding: "0 12px",
              background: "#F3E8DF",
              color: "#452829",
              marginBottom: 8,
            }}
            placeholder="Bearer token (optional)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <textarea
            rows={8}
            style={{
              height: "60%",
              fontSize: 16,
              borderRadius: 8,
              border: "none",
              background: "#F3E8DF",
              color: "#452829",
              padding: 16,
              resize: "vertical",
              marginBottom: 16,
            }}
            placeholder="GraphQL Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            style={{
              width: 180,
              height: 40,
              fontSize: 18,
              fontWeight: 500,
              borderRadius: 8,
              background: "#452829",
              border: "none",
              color: "#F3E8DF",
              margin: "0 auto",
              transition: "background 0.2s",
              cursor: "pointer",
            }}
            onClick={handleSend}
            disabled={loading || !url}
            onMouseOver={(e) => (e.currentTarget.style.background = "#57595B")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#452829")}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
        {/* Right: Result */}
        <div
          style={{
            width: 480,
            height: 800,
            background: "#E8D1C5",
            borderRadius: 12,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            minHeight: 320,
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#452829",
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            Result
            <button
              onClick={handleCopy}
              title="Copy result"
              style={{
                background: 'none',
                border: 'none',
                cursor: result || error ? 'pointer' : 'not-allowed',
                padding: 0,
                marginLeft: 6,
                display: 'flex',
                alignItems: 'center',
                opacity: result || error ? 1 : 0.4,
              }}
              disabled={!(result || error)}
            >
              <svg height="22" width="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="10" height="12" rx="2" stroke="#452829" strokeWidth="1.5" fill="#F3E8DF"/>
                <rect x="2" y="2" width="10" height="12" rx="2" stroke="#452829" strokeWidth="1.5" fill="#E8D1C5"/>
              </svg>
              <span style={{fontSize:12, marginLeft:4, color:'#452829'}}>{copied ? 'Copied!' : ''}</span>
            </button>
          </h2>
          <pre
            style={{
              width: "100%",
              background: "#F3E8DF",
              color: "#452829",
              fontSize: 16,
              margin: 0,
              padding: 10,
              border: "none",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              overflowY: "auto",
              maxHeight: 750,
              borderRadius: 10,
            }}
          >
            {result && JSON.stringify(result, null, 2)}
            {error && (
              <span style={{ color: "#d32f2f" }}>
                {typeof error === "string"
                  ? error
                  : JSON.stringify(error, null, 2)}
              </span>
            )}
            {!result && !error && (
              <span style={{ color: "#57595B" }}>
                Send a query to see the result here.
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <React.Fragment>
      <Router basename="/graphql-web-tester/">
        <Routes>
          <Route path="/" element={<GraphQLTester />} />
          <Route path="/samples" element={<SampleQueries />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
