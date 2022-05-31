import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Layout from 'layouts'
import Landing from 'pages/Landing'
import { useState } from 'react'

const App = () => {
  const [open, setOpen] = useState(false)
  return (
    <Router>
      <Switch>
        <Layout open={open} setOpen={setOpen}>
          <Route exact path='/'>
            <Landing setOpen={setOpen} />
          </Route>
        </Layout>
      </Switch>
    </Router>
  )
}

export default App