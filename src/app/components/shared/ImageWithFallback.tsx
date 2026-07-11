import { useState, useEffect } from "react";

const ERROR_SVG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=";

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const [didError, setDidError] = useState(false);
  const { src, alt, style, className, ...rest } = props;

  useEffect(() => {
    setLoaded(false);
    setDidError(false);
  }, [src]);

  if (didError) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-muted ${className ?? ""}`}
        style={{ ...style, minHeight: 80, minWidth: 80, flexShrink: 0 }}
      >
        <img src={ERROR_SVG} alt="Erreur de chargement" className="opacity-40 w-12 h-12" {...rest} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ background: "rgba(0,0,0,0.03)", flexShrink: 0, minHeight: 12, ...style }}
    >
      {!loaded && (
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.03) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }} />
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full"
        style={{
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setDidError(true)}
        {...rest}
      />
    </div>
  );
}
