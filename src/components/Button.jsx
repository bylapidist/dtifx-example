import { useMemo } from 'react';
import './button.css';

export function Button({ children = 'Primary action', emphasize = false, onClick }) {
  const inlineStyle = useMemo(() => {
    return emphasize
      ? {
          paddingInline: '24px',
          paddingBlock: '16px',
        }
      : undefined;
  }, [emphasize]);

  return (
    <button
      type="button"
      className="button-primary"
      style={inlineStyle}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
