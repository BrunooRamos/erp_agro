import ReactDOM from 'react-dom/client';

import { store } from './store/store'
import { Provider } from 'react-redux'

import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AgroModule } from './AgroModule';

const queryClient = new QueryClient(
  // Configuracion de react query
);

const container = document.getElementById('root')

if ( container ) {
  const root = ReactDOM.createRoot(container)
  root.render(
    <Provider store={ store }>
      <QueryClientProvider client={ queryClient }>
        <AgroModule />
      </QueryClientProvider>
    </Provider>
  )
} else {
  throw new Error('Root element with ID "root" was not found in the document. Ensure there is a corresponding HTML element with the ID "root" in your HTML file.')
}


// Asi es tal cual como se recomienda en la documentacion
// https://redux-toolkit.js.org/tutorials/quick-start