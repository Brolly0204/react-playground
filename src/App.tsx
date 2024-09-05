import ReactPlayground from './ReactPlayground';
import './App.scss'
import { PlaygroundProvider } from './ReactPlayground/PlaygroundProvider';

function App() {

  return (
    <PlaygroundProvider>
      <ReactPlayground/>
    </PlaygroundProvider>

  )
}

export default App
