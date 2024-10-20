// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js'
import axios from 'axios'
axios.defaults.withCredentials = true

function App() {
  return (
    <section className="fakeso">
      <FakeStackOverflow />
    </section>
  );
}

export default App;
