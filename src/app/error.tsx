'use client'

function errorBoundary({ error }: { error: Error }) {
  return (
    <div>{error.message}</div>
  )
}

export default errorBoundary