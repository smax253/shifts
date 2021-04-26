import React from 'react';
import { useParams } from 'react-router';

const Room = () => {

  const {id} = useParams();
  return (
    <div>
            Room ID {id}
    </div>
  )

}

export default Room