import './button.css';

export function Button({ children = 'Primary action', variant = 'primary', emphasize = false, onClick }) {
  const className = emphasize ? 'button-primary button-primary--emphasize' : 'button-primary';

  return (
    <button
      type="button"
      className={className}
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
