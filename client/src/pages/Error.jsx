import React from 'react'
import { useRouteError } from 'react-router-dom';

function Error() {

  const error = useRouteError();  
  
    return (
      <div>
        <h1>Oops🤯! &nbsp; An error occurred</h1>
        <h2>Error : {error.message}</h2>
        <pre> {error.status} - {error.statusText} </pre>
      </div>
    )
}

export default Error;
