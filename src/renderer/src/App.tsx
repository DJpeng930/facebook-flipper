import { LoginForm } from './components/login'
import { Button } from './components/ui/button'

function App(): React.JSX.Element {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          Acme Inc.
          <Button onClick={() => window.api.ping()}>Test</Button>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}

export default App
