import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { buildSchema, validate, parse, print } from "graphql";
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import SampleQueries from "./SampleQueries";
import { BASE_URL } from "./config";
import { useTranslation } from 'react-i18next'; // Thêm import

function GraphQLTester() {
    const { t, i18n } = useTranslation(); // Sử dụng hook
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState("http://localhost:4000/");
    const [token, setToken] = useState("");
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [schema, setSchema] = useState(null);
    const [enableAutocomplete, setEnableAutocomplete] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [isFormatted, setIsFormatted] = useState(true);
    const fileInputRef = useRef(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

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

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const schemaText = e.target.result;
            const parsedSchema = buildSchema(schemaText);
            setSchema(parsedSchema);
            setEnableAutocomplete(true);
          } catch (err) {
            alert("Invalid GraphQL schema file: " + err.message);
          }
        };
        reader.readAsText(file);
      }
    };

    const formatQuery = () => {
      try {
        const ast = parse(query);
        const formatted = print(ast);
        setQuery(formatted);
        setValidationErrors([]);
      } catch (err) {
        setValidationErrors([err.message]);
      }
    };

    const validateQuery = () => {
      if (schema) {
        const errors = validate(schema, query);
        setValidationErrors(errors.map(e => e.message));
      } else {
        setValidationErrors(["No schema loaded for validation"]);
      }
    };

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
          justifyContent: "space-between", // Thay đổi để thêm selector
          margin: "0 auto 32px auto",
          padding: "0 20px",
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
          {t('appTitle')} {/* Sử dụng key */}
        </h1>
        <select onChange={(e) => changeLanguage(e.target.value)} style={{ fontSize: 16 }}>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="vi">Tiếng Việt</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
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
        <a
          href={`${BASE_URL}samples`}
          target="_blank"
          rel="noopener noreferrer"
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
          {t('viewSampleQueries')} {/* Sử dụng key */}
        </a>
      </div>
      {/* Two Columns */}
      <div
        style={{
          width: "95%",
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
            width: "50%",
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
            placeholder={t('graphqlServerUrl')} // Sử dụng key
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
            placeholder={t('bearerToken')} // Sử dụng key
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <div style={{ marginBottom: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={enableAutocomplete}
                onChange={(e) => setEnableAutocomplete(e.target.checked)}
              />
              {t('enableAutocomplete')} {/* Sử dụng key */}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".graphql,.gql"
              onChange={handleFileUpload}
              style={{ marginLeft: 10 }}
            />
          </div>
          <div style={{ position: "relative", height: "60%", marginBottom: 16 }}>
            <Editor
              height="100%"
              language="graphql"
              value={query}
              onChange={setQuery}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                wordWrap: "on",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button
              onClick={formatQuery}
              style={{
                flex: 1,
                height: 40,
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 8,
                background: "#452829",
                border: "none",
                color: "#F3E8DF",
                cursor: "pointer",
              }}
            >
              {t('format')}
            </button>
            <button
              onClick={validateQuery}
              style={{
                flex: 1,
                height: 40,
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 8,
                background: "#452829",
                border: "none",
                color: "#F3E8DF",
                cursor: "pointer",
              }}
            >
              {t('validate')}
            </button>
          </div>
          {validationErrors.length > 0 && (
            <div style={{ color: "#d32f2f", fontSize: 14, marginBottom: 16 }}>
              <strong>{t('errors')}</strong> {/* Sử dụng key */}
              <ul>
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
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
            {loading ? t('sending') : t('send')} {/* Sử dụng key */}
          </button>
        </div>
        {/* Right: Result */}
        <div
          style={{
            width: "50%",
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
            {t('result')} {/* Sử dụng key */}
            <button
              onClick={handleCopy}
              title={t('copy')} // Sử dụng key
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
              <span style={{fontSize:12, marginLeft:4, color:'#452829'}}>{copied ? t('copied') : ''}</span> {/* Sử dụng key */}
            </button>
            <button
              onClick={() => setIsFormatted(!isFormatted)}
              title={isFormatted ? t('minify') : t('formatJson')} // Sử dụng key
              style={{
                background: 'none',
                border: 'none',
                cursor: result || error ? 'pointer' : 'not-allowed',
                padding: 0,
                marginLeft: 6,
                display: 'flex',
                alignItems: 'center',
                opacity: result || error ? 1 : 0.4,
                fontSize: 14,
                color: '#452829',
              }}
              disabled={!(result || error)}
            >
              {isFormatted ? t('minify') : t('formatJson')} {/* Sử dụng key */}
            </button>
          </h2>
          <div
            style={{
              width: "100%",
              background: "#F3E8DF",
              color: "#452829",
              fontSize: 16,
              margin: 0,
              padding: 10,
              border: "none",
              wordBreak: "break-word",
              overflowY: "auto",
              maxHeight: 750,
              borderRadius: 10,
            }}
          >
            {isFormatted ? (
              result ? (
                <JsonView
                  value={result}
                  style={{ ...lightTheme, background: 'transparent', fontSize: 16 }}
                  displayDataTypes={false}
                />
              ) : error ? (
                typeof error === 'string' ? (
                  <span style={{ color: "#d32f2f" }}>{error}</span>
                ) : (
                  <JsonView
                    value={error}
                    style={{ ...lightTheme, background: 'transparent', fontSize: 16 }}
                    displayDataTypes={false}
                  />
                )
              ) : (
                <span style={{ color: "#57595B" }}>{t('noResult')}</span> // Sử dụng key
              )
            ) : (
              <pre
                style={{
                  background: "transparent",
                  color: "#452829",
                  fontSize: 16,
                  margin: 0,
                  padding: 0,
                  border: "none",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  overflowY: "auto",
                  maxHeight: 750,
                  borderRadius: 10,
                }}
              >
                {result && JSON.stringify(result)}
                {error && (
                  <span style={{ color: "#d32f2f" }}>
                    {typeof error === "string"
                      ? error
                      : JSON.stringify(error)}
                  </span>
                )}
                {!result && !error && (
                  <span style={{ color: "#57595B" }}>
                    {t('noResult')} {/* Sử dụng key */}
                  </span>
                )}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <React.Fragment>
      <Router basename={BASE_URL}>
        <Routes>
          <Route path="/" element={<GraphQLTester />} />
          <Route path="/samples" element={<SampleQueries />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
