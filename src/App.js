import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { subscribeChain, connect } from './store/accountSlice'
import { fetchConnect } from './store/connectSlice'
import Layout from "./component/Layout";
import Claim from './pages/Claim'


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(connect());
    dispatch(fetchConnect());
    dispatch(subscribeChain());
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
