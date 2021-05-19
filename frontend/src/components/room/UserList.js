import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import { AuthContext } from '../../auth/AuthContext';

const UserList = ({userList}) => {

  const [auth] = useContext(AuthContext);

  const generateUsers = useCallback(() => {
    const users = [...userList];
    if (!users.includes(auth.username)) {
      users.push(auth.username);
    }
    const links = users.map((item)=>{

      return (
        <li key={item}>
         
          <div className="user">
            {item}
          </div>
        
        </li>
      )
    
    })
    return <ul>{links}</ul>
  
  }, [userList])

  return (
    <div className="user-list">
      <div id="user-list-label">Users</div>
      {generateUsers()}
    </div>
  )

}

UserList.propTypes = {
  userList: PropTypes.array.isRequired
}

export default UserList;