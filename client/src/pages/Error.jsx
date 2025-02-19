import React from 'react'
import { useRouteError } from 'react-router-dom';

function Error() {

  const error = useRouteError();  
  console.log(error);
  
    return (
      <div>
        <h1>Oops🤯! &nbsp; An error occurred</h1>
        <pre> {error.data} </pre>
      </div>
    )
}

export default Error;
