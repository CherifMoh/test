
import { addOrder } from '../(server)/actions/order'

function page({params}) {
  return (
    <div className="p-4 flex flex-col w-1/3 mx-auto mt-48 items-center justify-center border rounded-lg shadow-md bg-gray-50">
    <div className="text-lg font-medium text-gray-700 mb-2">{params.domain}</div>
    <button
      onClick={() => addOrder(params.domain, { name: params.domain })}
      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
    >
      Add
    </button>
  </div>
  
  )
}

export default page