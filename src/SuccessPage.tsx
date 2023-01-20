import React from "react";

export default function SuccessPage() {
  return (
    <div
      className="container"
      style={{ justifyContent: "center", height: "99vh" }}
    >
      <h1 style={{ textAlign: "center" }}>
        Success! Check your wallet for your squeaky clean BitWhip!
      </h1>
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          color: "white",
          backgroundColor: "#00aaaa",
          padding: 20,
          border: "none",
          borderRadius: "3px",
        }}
      >
        Back To Home
      </button>
    </div>
  );
}
