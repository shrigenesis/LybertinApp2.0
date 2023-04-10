import React, {createContext, Component} from 'react';
import {User} from './../utils/user';

export const LoginContext = createContext();

class LoginContextProvider extends Component {
  state = {
    isLogin: new User().isLogin(),
    type: new User().usertype(),
  };

  setLogin = isLogin => {
    new User().setLogin(isLogin);
    this.setState({isLogin: isLogin});
  };

  

  setType = type => {
    new User().setType(type);
    this.setState({type: type});
  };

  render() {
    return (
      <LoginContext.Provider
        value={{
          ...this.state,
          setLogin: this.setLogin,
          setType: this.setType,
        }}>
        {this.props.children}
      </LoginContext.Provider>
    );
  }
}

export default LoginContextProvider;

export const LoginConsumer = LoginContext.Consumer;
