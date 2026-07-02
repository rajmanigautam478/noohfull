import { useRef } from "react";

/**
 * ImageUploader
 * ---------------------------------------------------------------------------
 * For now, selected images are converted to base64 data URLs and stored
 * directly on the record — this keeps the panel fully working with zero
 * backend. Once you have a real upload endpoint (e.g. S3, Cloudinary, or
 * your own /api/upload), replace `fileToDataUrl` with a function that
 * uploads the file and returns the hosted URL instead.
 *
 * Props:
 *   images: string[] (urls or data URLs)
 *   onChange: (newImages: string[]) => void
 *   multiple: boolean
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ images = [], onChange, multiple = true }) {
  const inputRef = useRef(null);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    onChange(multiple ? [...images, ...dataUrls] : dataUrls.slice(0, 1));
    e.target.value = "";
  }

  function removeAt(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="image-grid">
        {images.map((src, idx) => (
          <div className="image-thumb" key={idx}>
            <img src={src} alt={`upload-${idx}`} />
            <button type="button" className="remove-btn" onClick={() => removeAt(idx)}>
              ✕
            </button>
          </div>
        ))}
        {(multiple || images.length === 0) && (
          <div className="upload-dropzone" onClick={() => inputRef.current.click()}>
            <span style={{ fontSize: 18 }}>+</span>
            Add image
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={handleFiles}
      />
    </div>
  );
}
