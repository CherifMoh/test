'use client'

function Error({ error }: { error: Error }) {
  return (
    <div>{error.message}</div>
  )
}

export default Error