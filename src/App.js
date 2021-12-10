import React from "react";
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom'
import Layout from "./component/Layout";
import Claim from './pages/Claim'


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/" component={Claim}></Route>
          <Redirect to="/" />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
