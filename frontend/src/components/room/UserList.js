import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserList = ({userList}) => {

  const generateUsers = useCallback(()=>{

    const links = userList.map((item)=>{

      return (
        <li key={item.id}>
          <Link to={`/profile/${item.id}`}>
            <div className="user">
              {item.name}
            </div>
          </Link>
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