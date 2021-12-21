import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fetchConnect } from './store/connectSlice';
import Layout from "./component/Layout";
import Claim from './pages/Claim'


function App() {
  const dispatch = useDispatch();
  let account = useSelector(state => state.connect.account);
  useEffect(() => {
    if (account) {
      dispatch(fetchConnect());
    }
  }, [dispatch, account])

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
