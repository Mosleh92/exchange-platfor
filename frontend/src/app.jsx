// src/App.jsx - اضافه کردن Context ها
import { P2PProvider } from './context/P2PContext';
import { TenantProvider } from './context/TenantContext';

function App() {
  return (
    <TenantProvider>
      <P2PProvider>
        <AuthProvider>
          <LocaleProvider>
            <CurrencyProvider>
              <AppRouter />
            </CurrencyProvider>
          </LocaleProvider>
        </AuthProvider>
      </P2PProvider>
    </TenantProvider>
  );
}