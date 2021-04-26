function sleep(ms) {

  return new Promise(resolve => setTimeout(resolve, ms));

}

const fakeAuth = {
  isAuthenticated: false,
  authenticate: async()=>{

    fakeAuth.isAuthenticated = true;
    await sleep(100);
  
  },
  signout: async()=>{

    fakeAuth.isAuthenticated = false;
    await sleep(100)
  
  }
}

export default fakeAuth;