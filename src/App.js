import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import './App.css';
import Header from './components/header/header.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';

import HomePage from './pages/home/home.component';
import ShopPage from './pages/shop/shop.component';
import SignInUp from './pages/sign-in-up/sign-in-up.component';
import Checkout from './pages/checkout/checkout.component'
import setCurrentUser from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';


class App extends Component {

  // constructor(props){
  //   super(props)

  //   this.state= {
  //     currentUser: null
  //   }
  // }

  unsubscribeFromAuth = null

  componentDidMount(){
    const {setCurrentUser} = this.props
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth=>{

      if(userAuth){
        const userRef = await createUserProfileDocument(userAuth)

        userRef.onSnapshot(snapshot=>{
          // this.setState(
            setCurrentUser(
              {
                currentUser: {

                  id: snapshot.id,
                  ...snapshot.data()
                } 
              }, 
              // ()=> console.log(this.state)
          );
          // ()=> console.log(this.state)
        })
        
      }
     
      // this.setState({currentUser: userAuth})
      setCurrentUser(userAuth)
    })
  }

  componentWillUnmount(){
    this.unsubscribeFromAuth()
  }
  
  render() {
    return (
      <div>
        {/* <Header currentUser={this.state.currentUser}/>  */}
        <Header /> 
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route  path='/shop' component={ShopPage} />
          <Route exact path='/checkout' component={Checkout} />
          {/* <Route  path='/signing' component={SignInUp} /> */}

          {/* <Route 
            exact  
            path='/signing' 
            render={this.props.currentUser && <Redirect to='/'/>} 
            component={SignInUp}
            // <SignInUp/>
          /> */}
          <Route 
            exact  
            path='/signing' 
            render={
                      ()=> this.props.currentUser !== null
                        ? 
                        (
                          <Redirect to='/'/>
                        ) 
                        : (
                          <SignInUp/>
                          )
                    } 
          />


        </Switch>
      </div>
    );
  }

}
const mapTStateToProps = createStructuredSelector ({ // {user}
  currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapTStateToProps, mapDispatchToProps)(App); //HOC
