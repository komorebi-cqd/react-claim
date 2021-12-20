import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { fetchConnect, subsribeChain } from './store/connectSlice'
import Layout from "./component/Layout";
import Claim from './pages/Claim'


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchConnect());
    dispatch(subsribeChain());
  }, [dispatch])

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
