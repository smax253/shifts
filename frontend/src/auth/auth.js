

const auth = {
  isAuthenticated: false,
  authtoken: null,
  authenticate: async(authtoken)=>{

    auth.isAuthenticated = true;
    auth.authtoken = authtoken;
  
  },
  signout: async()=>{

    auth.isAuthenticated = false;
  
  }
}

export default auth;