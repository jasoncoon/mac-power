import { Alert, App as AntApp, ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import { Main } from './components/Main';
import "./index.css";

export function App() {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <AntApp>
        <Alert.ErrorBoundary>
          <div className="app">
            <Main />
          </div>
        </Alert.ErrorBoundary>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
