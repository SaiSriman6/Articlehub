import React from 'react'
import { useRouteError } from 'react-router'

function Errorboundary() {
    let {status,data,statusText}=useRouteError()
  return (
    <div>
        <p>{data}</p>
        <p>{status}-{statusText}</p>
    </div>
  )
}

export default Errorboundary