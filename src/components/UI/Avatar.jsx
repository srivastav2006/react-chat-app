import { generateAvatar } from '../../utils/helper';

export const Avatar = ({ src, alt, size = 'md', online = false, className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const onlineIndicatorSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white shadow-sm`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      <div
        className={`${sizes[size]} rounded-full ${generateAvatar(alt || 'User')} flex items-center justify-center text-white font-semibold ${src ? 'hidden' : 'flex'}`}
        style={{ display: src ? 'none' : 'flex' }}
      >
        {getInitials(alt)}
      </div>

      {online && (
        <div className={`absolute bottom-0 right-0 ${onlineIndicatorSizes[size]} bg-green-500 rounded-full border-2 border-white shadow-sm`}></div>
      )}
    </div>
  );
};
