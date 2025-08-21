export const Avatar = ({ src, alt, size = 'md', online = false }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover`}
      />
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};
