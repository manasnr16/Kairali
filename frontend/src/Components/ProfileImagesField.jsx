import React from "react";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { IMAGE_RULES } from "../data/biodataOptions";

// Controlled multi-image picker. `images` is an array of hosted URLs and the
// first one is used as the profile's main photo. Files are validated (type,
// size, count) before being sent to the host via `uploadImage`.
const ProfileImagesField = ({ images = [], onChange, uploadImage, uploading, minImages = IMAGE_RULES.min }) => {
  const { max, maxSizeMB, accept } = IMAGE_RULES;

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const room = max - images.length;
    if (room <= 0) {
      toast.error(`You can upload at most ${max} images.`);
      return;
    }

    const valid = [];
    for (const file of files) {
      if (!accept.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG or WEBP images are allowed.`);
      } else if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name}: larger than ${maxSizeMB} MB.`);
      } else {
        valid.push(file);
      }
    }

    if (valid.length > room) {
      toast.error(`Only ${room} more image${room === 1 ? "" : "s"} allowed (max ${max}). Extra files were skipped.`);
    }

    const uploaded = [];
    for (const file of valid.slice(0, room)) {
      const url = await uploadImage(file);
      if (url) uploaded.push(url);
    }
    if (uploaded.length) onChange([...images, ...uploaded]);
  };

  const remove = (index) => onChange(images.filter((_, i) => i !== index));

  return (
    <div>
      <input
        type="file"
        multiple
        accept={accept.join(",")}
        onChange={handleFiles}
        disabled={uploading || images.length >= max}
        className="w-full rounded border border-gray-300 cursor-pointer hover:border-gold transition disabled:opacity-60 disabled:cursor-not-allowed"
      />
      <p className="text-xs text-gray-500 mt-1">
        {minImages === max ? `Upload ${max}` : `Upload ${minImages}–${max}`} images (JPG, PNG or WEBP, up to {maxSizeMB} MB each).
        The first image is the main profile photo. {images.length}/{max} added.
      </p>
      {uploading && <p className="text-blue-500 text-xs mt-1">Uploading...</p>}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {images.map((url, i) => (
            <div key={url + i} className="relative">
              <img src={url} alt={`Profile ${i + 1}`} className="w-20 h-20 object-cover rounded-md border" />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-maroon/80 text-white text-[10px] text-center rounded-b-md">
                  Main
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove image"
                className="absolute -top-2 -right-2 bg-white border rounded-full w-5 h-5 flex items-center justify-center text-red-500 text-xs shadow"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileImagesField;
