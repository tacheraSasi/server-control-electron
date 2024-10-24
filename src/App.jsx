import AppLayout from "./components/AppLayout";
import ServiceApp from "./components/ServiceApp";

function App({appName}) {
  console.log(appName)
  return (
    <AppLayout>
      <ServiceApp />
    </AppLayout>
  );
}

export default App;
