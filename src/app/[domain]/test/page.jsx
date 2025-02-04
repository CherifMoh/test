import axios from "axios"

async function page({params}) {

  let Orders = null

  try{
    const response =  await axios.get('http://localhost:3000/api?domain='+params.domain);
    Orders = response.data
  }catch(err){
      console.log(err.message)
  }


  const OrdersEle = Orders.map((order) => {
    return (
      <div>
        <p>{order.name}</p>
      </div>
    )
  })

  return (
    <div>
      {OrdersEle}
    </div>
  )
}

export default page