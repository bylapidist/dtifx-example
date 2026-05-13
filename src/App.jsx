import { Button } from './components/Button.jsx';

export function App() {
  return (
    <main>
      <Button variant="primary">Get started</Button>
      <Button variant="secondary" emphasize>
        Learn more
      </Button>

      {/*
        design-lint-disable design-system/component-prefix
        Intentional: legacy entry point kept for backwards compat.
        Prefix enforcement waived until DS-412 migration is complete.
      */}
      <Button variant="primary" onClick={() => window.location.assign('/legacy')}>
        Legacy entry
      </Button>
      {/* design-lint-enable design-system/component-prefix */}
    </main>
  );
}
