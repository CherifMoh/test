"use client"

import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "../../../components/loadings/Spinner";
import '../../../styles/pages/landingPage.css'
import { v4 as uuidv4 } from 'uuid'
import { generateUniqueString } from '../../../app/lib/utils';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs, faLocationDot, faMinus, faPaperPlane, faPhone, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";




async function fetchWilayt() {
    const res = await axios.get('/api/wilayas/wilayasCodes');
    return res.data.wilayas;
}
async function fetchFees() {
    const res = await axios.get('/api/wilayas/fees');
    return res.data.fees;
}
async function fetchCommunes() {
    const res = await axios.get('/api/wilayas/communes');
    return res.data.communes;
}


function LindingPage({ params }) {
  
  async function fetchProducts() {
    const res = await axios.get(`/api/products/${params.productId}`);
    return res.data;
  }

  const { data: products, isLoading, isError,error } = useQuery({
    queryKey: ['product'],
    queryFn: fetchProducts
  });

  const { data: communes, isLoading: communesLoding, isError: communesIsErr, error: communesErr } = useQuery({
    queryKey: ['communes'],
    queryFn: fetchCommunes
  });
  const { data: fees, isLoading: feesLoding, isError: feesIsErr, error: feesErr } = useQuery({
      queryKey: ['fees'],
      queryFn: fetchFees
  });
  const { data: wilayat, isLoading: wilayatLoding, isError: wilayatIsErr, error: wilayatErr } = useQuery({
      queryKey: ['wilayat'],
      queryFn: fetchWilayt
  });

  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({});

  // Form validation States
  const [isShippingSelected, setIsShippingSelected] = useState(true);
  const [isWilayaSelected, setIsWilayaSelected] = useState(true);
  const [isPhoneCorrect, setIsPhoneCorrect] = useState(true);

  const [isBeruAvailable, setIsBeruAvailable] = useState(true)

  const [slectedCommunes, setSlectedCommunes] = useState([]);

  const [mproduct, setMproduct] = useState({})

  const [qnt, setQnt] = useState(1)

  const [shippingPrice, setShippingPrice] = useState(null)

  const [price, setPrice] = useState(null)
  
  const [totalPrice, setTotalPrice] = useState(null)

  const [wrongSubmit, setWrongSubmit] = useState(false)
  
  const [isSubmiting, setIsSubmitting] = useState(false)
    
    

    useEffect(() => {
        if (!products) return
        setMproduct(products[0])
        setFormData(pre => ({
            ...pre,
            orders:[{
                title: products[0].title,
                imageOn: products[0].imageOn,
                qnt: qnt,
                _id: uuidv4(),
                ...(products[0]?.options?.length > 0 && { options: products[0].options })
            }],
            reference: generateUniqueString()
        }))
    }, [products,qnt])


    useEffect(() => {
        if (!wilayat || !fees) return

        wilayat.forEach(wilaya => {
            if (wilaya.wilaya_name === formData.wilaya) {

                const feesArray = Object.values(fees.livraison);
                const filteredFee = feesArray.filter(fee => fee.wilaya_id === wilaya.wilaya_id)[0];

                const adomicile = filteredFee.tarif;
                const stopdesk = filteredFee.tarif_stopdesk;
                if (adomicile === '') {
                    setIsBeruAvailable(false)
                    setFormData(pre => ({
                        ...pre,
                        shippingMethod: 'مكتب',
                        shippingPrice: stopdesk
                    }))
                    setShippingPrice(stopdesk)
                } else {
                    setIsBeruAvailable(true)
                }

                if (formData.wilaya && formData.shippingMethod) {
                    if (wilaya.wilaya_name === formData.wilaya) {
                        // setFormData(pre => ({
                        //     ...pre,
                        //     shippingMethod: 'بيت',
                        //     shippingPrice: adomicile
                        // }))
                        formData.shippingMethod === 'بيت'
                            ? setFormData(pre => {
                                setShippingPrice(adomicile)
                                return {
                                    ...pre,
                                    shippingMethod: 'بيت',
                                    shippingPrice: adomicile
                                }
                            })
                            
                            : setFormData(pre => {
                                setShippingPrice(stopdesk)
                                return {
                                    ...pre,
                                    shippingMethod: 'مكتب',
                                    shippingPrice: stopdesk
                                }
                            })
                    }
                }

            }
        })
    }, [formData.wilaya,formData.shippingMethod])

    useEffect(() => {
        if(!mproduct) return

        let beforePrice = mproduct.price  
        let sales
        let isSales = false


        mproduct.sales?.forEach(sale => {
            if(Number(sale.qnt) <= qnt){
              sales = sale.percen
              isSales = true
            }
        });

        setPrice(sales?(beforePrice-(beforePrice*sales)/100)*qnt:beforePrice*qnt)
        
    }, [qnt,mproduct])

    useEffect(() => {
        
        setTotalPrice(Number(price) + Number(shippingPrice))
        
    }, [qnt,price,mproduct,shippingPrice])
    

    useEffect(() => {
        setFormData(pre => ({
            ...pre,
            totalPrice,
            shippingPrice,
        }))

    }, [totalPrice,shippingPrice,qnt])

    useEffect(() => {
      if (!communes|| !wilayat||!formData.wilaya) return

      const wilayaCode = wilayat.find(wilaya => wilaya.wilaya_name === formData.wilaya).wilaya_id


      const communesArray = Object.values(communes);
      const filteredCommunes = communesArray.filter(commune => commune.wilaya_id === wilayaCode);

      setSlectedCommunes(filteredCommunes)

    }, [formData.wilaya,communes,wilayat])

    console.log(formData)

  const router =useRouter()

  typeof document !== 'undefined' && document.body.classList.add('bg-white')

  if (isLoading || wilayatLoding || feesLoding) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (wilayatIsErr) return <div>Error: {wilayatErr.message}</div>;
  if (feesIsErr) return <div>Error: {feesErr.message}</div>;
  
  if(!Array.isArray(mproduct?.landingPageImages) && mproduct?.landingPageImages?.length === 0) return
  if(!mproduct?.landingPageImages) return


  if (typeof products !== 'object' || mproduct?.landingPageImages?.length === 0) {
    return notFound()
  }


  const phonePattern = /^0\d{9}$/;
  async function handelSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true); // Set isSubmitting to true

    // Check phone pattern
    if (!phonePattern.test(formData.phoneNumber)) {
        setWrongSubmit(true)
        setIsPhoneCorrect(false);
        setIsSubmitting(false); // Set isSubmitting to false
        return; // Exit the function
    }

    // Check if wilaya is selected
    if (!formData.wilaya) {
        setWrongSubmit(true)
        setIsWilayaSelected(false);
        setIsSubmitting(false); // Set isSubmitting to false
        return; // Exit the function
    }

    // Check if shipping method is selected
    if (!formData.shippingMethod) {
        setWrongSubmit(true)
        setIsShippingSelected(false);
        setIsSubmitting(false); // Set isSubmitting to false
        return; // Exit the function
    }

    try {
        // Make API call
        const res = await axios.post(`/api/orders`, formData);

        // Refresh and navigate to thank you page
        router.refresh();
        router.push('/thankyou');
    } catch (error) {
        // Handle error if necessary
        console.error('Error submitting form:', error);
    }

  }


  const handleChange = (e) => {
    const value = e.target.value
    const name = e.target.name

    setFormData(preState => ({
        ...preState,
        [name]: value
    }))
    
    if(name === 'commune'){
        setFormData(preState => ({
            ...preState,
            adresse: value
        }))
    }
  }

  const wilayatOptionsElement = wilayat.map(wilaya => (
    <option key={wilaya.wilaya_id} value={wilaya.wilaya_name}>
        {wilaya.wilaya_id} {wilaya.wilaya_name}
    </option>
  ))

  const communesOptionsElement = slectedCommunes.map(commune => (
      <option key={commune.nom} value={commune.nom}>
          {commune.nom}
      </option>
  ))

  const inputsStyle = {
    fontSize: '13.5px',
    padding: '13.5px 11px',
    borderRadius: '20px',
    width: '100%',
    marginBottom: '15px',
    border: '1px solid rgb(138, 138, 138)',
    letterSpacing: 'normal'
  };

  function handelQntPlus(){
    setQnt(pre=>Number(pre) + 1)
    setFormData(preState => ({
        ...preState,
        qnt: Number(qnt) + 1
    }))
  }

  function handelQntMinus(){
    if(qnt <= 1) return
    setQnt(pre=>Number(pre) - 1)
    setFormData(preState => ({
        ...preState,
        qnt: Number(qnt) - 1
    }))
  }


  return (

    <main>
        <img 
            src={mproduct?.landingPageImages[0]} alt="" 
            className="w-full"
        />

        <section 
            ref={ref} id="checkout"  
            className="w-full relative flex flex-col items-center justify-center p-4"
        > 
            
            <img 
                src={mproduct?.landingPageImages[2]} alt="" 
                className="w-full absolute top-0 left-0 -z-10"
            />

            <form 
                onSubmit={handelSubmit} 
                className={`${wrongSubmit && 'bg-gradient-radial from-red-300  to-transparent bg-opacity-10'} w-full sm:w-3/4 md:w-2/3 lg:w-1/3 xl:w-1/4 p-5 border-2 border-black rounded-3xl`}
            >
                <h1 className="text-2xl font-semibold text-center tracking-wide">
                    استمارة الطلب
                </h1>
                <p
                    className={`text-red-600 ${wrongSubmit ? 'block' : 'hidden'} font-semibold text-sm text-center`}
                >
                    املأ معلوماتك بشكل صحيح
                </p>
                <div>
                    <p className="mt-2 font-semibold">
                        الاسم الشخصي
                        <span className="text-red-600 text-lg font-bold ml-1">*</span>
                    </p>

                    <div className="flex w-full rounded-md bg-white border border-[rgba(0, 40, 100, 0.12)]">

                        <FontAwesomeIcon icon={faUser} className="text-red-500 p-2 pr-5 border-r border-[rgb(0, 40, 100)]" />
                        <input
                            onChange={handleChange}
                            required
                            className="flex-grow pl-2 bg-transparent"
                            placeholder="الاسم الشخصي"
                            name="name"
                            type="text"
                        />
                    </div>
                </div>
                <div>
                    <p className="mt-2 font-semibold">
                        الهاتف
                        <span className="text-red-600 text-lg font-bold ml-1">*</span>
                    </p>

                    <div className="flex w-full rounded-md bg-white border border-[rgba(0, 40, 100, 0.12)]">

                        <FontAwesomeIcon icon={faPhone} className="text-red-500 p-2 pr-5 border-r border-[rgb(0, 40, 100)]" />
                        <input
                            onChange={handleChange}
                            required
                            className="flex-grow pl-2 bg-transparent"
                            placeholder="رقم الهاتف"
                            name="phoneNumber"
                            type="text"
                        />
                    </div>
                </div>
                <div>
                    <p className="mt-2 font-semibold">
                        الولاية
                        <span className="text-red-600 text-lg font-bold ml-1">*</span>
                    </p>

                    <div className="flex w-full rounded-md bg-white border border-[rgba(0, 40, 100, 0.12)]">

                        <FontAwesomeIcon icon={faPaperPlane} className="text-red-500 p-2 pr-5 border-r border-[rgb(0, 40, 100)]" />
                        <select
                            value={formData.wilaya}
                            onChange={handleChange}
                            required 
                            className="flex-grow pl-2 bg-transparent"
                            name="wilaya"
                        >
                            <option value="الولاية" hidden >الولاية</option>
                            {wilayatOptionsElement}
                        </select>
                    </div>
                </div>
                <div>
                    <p className="mt-2 font-semibold">
                        الولاية
                        <span className="text-red-600 text-lg font-bold ml-1">*</span>
                    </p>

                    <div className="flex w-full rounded-md bg-white border border-[rgba(0, 40, 100, 0.12)]">

                        <FontAwesomeIcon icon={faLocationDot} className="text-red-500 p-2 pr-5 border-r border-[rgb(0, 40, 100)]" />
                        <select
                            value={formData.commune}
                            onChange={handleChange}
                            className="flex-grow pl-2 bg-transparent"
                            required 
                            name="commune"
                        >
                            <option hidden >
                                البلدية
                            </option>
                            {communesOptionsElement}
                        </select>
                    </div>
                </div>
                <div>
                    <p className="mt-2 font-semibold">
                        طريقة التوصيل
                        <span className="text-red-600 text-lg font-bold ml-1">*</span>
                    </p>

                    {isBeruAvailable
                        ? 
                        <div className="flex w-full rounded-md bg-white border border-[rgba(0, 40, 100, 0.12)]">

                            <FontAwesomeIcon icon={faLocationCrosshairs} className="text-red-500 p-2 pr-5 border-r border-[rgb(0, 40, 100)]" />
                            <select
                                value={formData.shippingMethod}
                                onChange={handleChange}
                                className="flex-grow pl-2 bg-transparent"
                                required
                                name="shippingMethod"
                            >
                                <option value='طريقة التوصيل' hidden >طريقة التوصيل</option>
                                <option value="بيت">بيت</option>
                                <option value="مكتب">مكتب</option>
                            </select>
                        </div>
                        : <div className='my-5 w-full text-center text-xl font-semibold'>
                            التوصيل الى البيت فقط
                        </div>
                    }
                </div>
                <div className="flex justify-between items-center mt-4">
                    <p className="font-semibold">
                        أدخل الكمية
                    </p>
                    <div className="flex justify-between w-2/3 bg-white h-10 rounded-md border border-[#a64100]">
                        <div 
                            className="w-14 text-center bg-[#a64100] cursor-pointer"
                            onClick={handelQntPlus}
                        >
                            <FontAwesomeIcon 
                                icon={faPlus} 
                                className="text-white translate-y-1/2 pointer-events-none" 
                            />
                        </div>
                        <div className="text-center flex items-center">
                            {qnt}
                        </div>
                        <div 
                            className="w-14 text-center bg-[#a64100] cursor-pointer"
                            onClick={handelQntMinus}
                        >
                            <FontAwesomeIcon 
                                icon={faMinus} 
                                className="text-white translate-y-1/2 pointer-events-none" 
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full bg-[#a64100] mt-4 text-white">
                    <div class="text-center font-semibold text-xl pt-4">
                        ملخص الطلب
                    </div>
                    <div className="flex justify-between px-4">
                        <span>سعر المنتج</span>
                        <div>
                            {price !== mproduct.price*qnt &&
                                <span class="product-price mr-3 text-gray-300 opacity-80 line-through">
                                    {mproduct.price*qnt} 
                                </span>
                            }
                            <span class="product-price">
                                {price} DZD
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between px-4 mt-2">
                        <span>سعر التوصيل</span>
                        {shippingPrice 
                            ?<span class="shipping-price"> {shippingPrice} DZD </span> 
                            :<span class="shipping-price">أدخل الولاية&nbsp;</span> 
                        }
                    </div>
                    <div className="flex justify-between text-xl border-t border-[rgba(0, 40, 100, 0.12)] px-4 py-3 mt-1">
                        <span>
                            المجموع
                        </span>
                        {(shippingPrice && mproduct.price )
                            ?<span class="shipping-price">
                                {totalPrice} DZD
                            </span> 
                            :<span class="shipping-price">أدخل الولاية&nbsp;</span> 
                        }
                    </div>
                    
                </div>
                <button 
                    type="submit" 
                    className={`w-full mx-auto rounded-lg mt-4 p-3 border-none bg-[#1773B0] text-xl font-semibold tracking-wide text-white ${isSubmiting && 'h-16'} flex justify-center items-start`}
                >
                    {isSubmiting
                        ? <Spinner color={'border-gray-500'} size={'h-10 w-10 '} />
                        :
                        ' أطلب الان'
                    }
                </button>
            </form>

            <form className="w-full hidden sm:w-3/4 md:w-2/3 lg:w-1/3 p-5" onSubmit={handelSubmit}>
                
                <div className="flex gap-4">
                
                    <input
                        onChange={handleChange}
                        required
                        // className="text-sm rounded w-full mb-4 border border-gray-400 p-3"
                        style={inputsStyle}
                        placeholder="الاسم"
                        name="name"
                        type="text"
                    />

                    {!isPhoneCorrect &&
                        <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                            أدخل رقم هاتف صحيح
                        </h1>
                    }

                    <input
                        onChange={handleChange}
                        required
                        className="phone"
                        style={inputsStyle}
                        placeholder="رقم الهاتف"
                        name="phoneNumber"
                        type="text"
                    />
                </div>
                <div className="flex gap-4">

                    {!isWilayaSelected &&
                        <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                            أدخل الولاية
                        </h1>
                    }

                    <select
                        value={formData.wilaya}
                        onChange={handleChange}
                        required className="wilaya"
                        style={inputsStyle}
                        name="wilaya"
                    >
                        <option value="الولاية" hidden >الولاية</option>
                        {wilayatOptionsElement}
                    </select>

                    <select
                        value={formData.commune}
                        onChange={handleChange}
                        style={inputsStyle}
                        required className="wilaya"
                        name="commune"
                    >
                        <option hidden >
                            البلدية
                        </option>
                        {communesOptionsElement}
                    </select>

                </div>
                <div className="flex w-1/2 mx-auto gap-4">

                    {/* <input
                        onChange={(e) =>{
                            setQnt(e.target.value)
                            setFormData(preState => ({
                                ...preState,
                                qnt: e.target.value
                            }))
                        }}
                        required
                        value={qnt}
                        style={inputsStyle}
                        placeholder="الكمية"
                        type="number"
                    /> */}

                    {!isShippingSelected &&
                        <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                            أدخل طريقة التوصيل
                        </h1>
                    }



                    {isBeruAvailable
                        ? <select
                            value={formData.shippingMethod}
                            onChange={handleChange}
                            style={inputsStyle}
                            required
                            className='shippingmethod'
                            name="shippingMethod"
                        >
                            <option value='طريقة التوصيل' hidden >طريقة التوصيل</option>
                            <option value="بيت">بيت</option>
                            <option value="مكتب">مكتب</option>
                        </select>
                        : <div className='my-5 w-full text-center text-xl font-semibold'>
                            التوصيل الى البيت فقط
                        </div>
                    }
                </div>
                <button 
                    type="submit" 
                    className={`w-1/2 mx-auto rounded-full p-3 border-none bg-[#1773B0] text-sm font-semibold tracking-wide text-white ${isSubmiting && 'h-16'} flex justify-center items-start`}
                >
                    {isSubmiting
                        ? <Spinner color={'border-gray-500'} size={'h-10 w-10 '} />
                        :
                        ' أطلب الان'
                    }
                </button>
            </form>

            <div class="order-summary-contaainer hidden">
                <span class="summary-title">ملخص الطلبية</span>&nbsp;
                <div class="delevry">
                    <span class="product-price">
                        {mproduct.price}
                    </span>
                    <span class="summary-option">Da : سعر المنتج</span>
                </div>
                <img 
                    src="https://media-public.canva.com/cl77U/MAE9OUcl77U/1/t.png" 
                    alt="" class="fr-fil fr-dib"
                />
                <div class="delevry">
                    {shippingPrice 
                        ?shippingPrice
                        :<span class="shipping-price red">أدخل الولاية&nbsp;</span> 
                    }
                    <span class="summary-option">&nbsp;: سعر التوصيل</span>
                </div>
                <img 
                    src="https://media-public.canva.com/cl77U/MAE9OUcl77U/1/t.png" 
                    alt="" class="fr-fil fr-dib"
                />
                <div class="delevry">
                    {(shippingPrice && mproduct.price )
                        ?Number(shippingPrice) + Number(mproduct.price)
                        :<span class="shipping-price red">أدخل الولاية&nbsp;</span> 
                    }
                    <span class="summary-option">&nbsp;: سعر الكلي</span>
                </div>
                <img 
                    src="https://media-public.canva.com/cl77U/MAE9OUcl77U/1/t.png" 
                    alt="" class="fr-fil fr-dib"
                />
            </div>

        </section>

        {!inView &&
            <a
                className="bg-red-500 button-glow-jump text-white w-48 rounded-md fixed bottom-6 left-1/2 translate-x-1/2 text-lg text-center font-bold p-4 "
                href="#checkout"
            >
                أطلب الان 
            </a>
        }

        <img 
            src={mproduct?.landingPageImages[1]} alt="" 
            className="w-full"
        />
    </main>
  )
}

export default LindingPage