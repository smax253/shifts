import React from 'react';
import { useParams } from 'react-router';

const Profile = () => {

  const {id}  = useParams();

    
  return (
    <div>
            Profile ID {id}
    </div>
  )

}

export default Profile