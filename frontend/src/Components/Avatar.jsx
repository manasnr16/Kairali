import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

/**
 * Profile picture with a graceful fallback. Renders the given photo URL when
 * one exists and actually loads; otherwise (or if the URL 404s/fails) falls
 * back to a generic user icon instead of a broken-image glyph — there is no
 * "/default-avatar.png" asset in the project, so relying on that path alone
 * silently breaks for anyone without a profile photo.
 *
 * Pass sizing/border/shadow classes via `className` (e.g. "w-10 h-10
 * border-2 border-gold") — they apply the same way whether the fallback
 * icon or the real image ends up rendering.
 */
const Avatar = ({ src, alt = 'Profile', className = 'w-10 h-10' }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <FaUserCircle
        aria-label={alt}
        className={`text-gray-300 bg-gray-50 rounded-full shrink-0 ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover rounded-full shrink-0 ${className}`}
    />
  );
};

export default Avatar;
