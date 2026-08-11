import { useState, useRef } from "react";
import { resizeImage } from "../utils/image";

export default function ImageUpload({ value, onChange }) {
  const [preview, setPreview] = useState(value || "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setError("No file was selected. Please try again.");
      return;
    }

    setError("");

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, GIF, WEBP).");
      e.target.value = "";
      return;
    }

    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const finalDataUrl = await resizeImage(file, 300, 0.6);
      URL.revokeObjectURL(objectUrl);
      setPreview(finalDataUrl);
      onChange(finalDataUrl);
    } catch (err) {
      URL.revokeObjectURL(objectUrl);
      setError(err.message);
      setPreview("");
      onChange("");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const clearImage = () => {
    setPreview("");
    setError("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label>Product Image</label>
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "8px", flexWrap: "wrap" }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {preview ? (
            <img src={preview} alt="Product preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "2.5rem", color: "var(--primary-200)" }}>🐾</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label
            className="btn btn-secondary"
            style={{ cursor: "pointer", display: "inline-flex", opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? "Processing..." : "📁 Choose Photo"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </label>
          <p style={{ color: "var(--ppp-text-muted)", fontSize: "0.8rem", marginTop: "6px" }}>
            Click the button above and select a JPG, PNG or GIF photo.
          </p>
          {preview && (
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ marginTop: "8px", marginRight: "8px" }}
              onClick={clearImage}
            >
              Remove Image
            </button>
          )}
          {uploading && (
            <p style={{ color: "var(--primary)", fontSize: "0.85rem", marginTop: "6px", fontWeight: 600 }}>
              Compressing photo...
            </p>
          )}
          {error && (
            <p style={{ color: "var(--error)", fontSize: "0.85rem", marginTop: "6px" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
