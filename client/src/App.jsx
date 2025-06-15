import { Route, Router } from 'react-router';
import TextEditor from './TextEditor';
import { v4 as uuidV4 } from 'uuid';

function App() {
  return (
    <Router>
      <switch>
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>

        <Route path="/documents/:id">
          <TextEditor />
        </Route>
      </switch>
    </Router>
  );
}

export default App;
