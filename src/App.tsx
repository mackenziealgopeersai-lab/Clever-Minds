/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div id="app-root" className="font-sans antialiased">
      {!hasStarted ? (
        <WelcomeScreen onStart={() => setHasStarted(true)} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
