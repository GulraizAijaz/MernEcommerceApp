import { useState,useEffect } from 'react'
import Layout from "./Layout"
import { readSingleProduct,listRelated } from './apiCore'
import Card from './Card'
import { useParams } from 'react-router-dom';

const Product = (props)=>{
    const [product,setProduct] = useState({})
    const [relatedProducts,setRelatedProducts] = useState([])
    const [error,setError] = useState(false)
    const {productId} = useParams()

    const loadSignleProduct = productId =>{
        readSingleProduct(productId).then(data=>{
            if(data.error){
                setError(data.error)
            }
            else{
                setProduct(data)
                listRelated(data.product._id).then(data=>{
                    if(data.error){
                        setError(data.error)
                        
                    }
                    else{
                        setRelatedProducts(data)
                    }
                })
            }
        })
    }
    const loadingProduct = ()=>{
        return(
        <div className='flex justify-center font-black min-h-full bg-red-700 min-w-full items-center '>
            <h1 className='text-8xl'>loading... please wait</h1>
        </div>
        )
    }
    const noRelatedProducts = ()=>{
        return(
            <span className='text-3xl bg-red-400  font-black rounded-xl p-2'>
                {`No Product related to (${product.product ? (product.product.category.name):null})Category`}
            </span>
        )
    }
    useEffect(()=>{
        loadSignleProduct(productId)
    },[productId])
    return(
        <Layout title={`product (${product.product ? product.product.name : "name"})`} description="Product Full Details"className='bg-gray-200'>
                <div className='p-2 w100 flex flex-wrap justify-between bg-yellow-400'>
                    <div className='w70 mobile-product-card  flex justify-center items-start '>
                        {product.product ? 
                        (<Card product={product.product}
                        productwidth='w80'
                        details={true}
                        showviewproductbutton={false}
                        />)
                        :
                        (loadingProduct())
                        }
                    </div>
                    <div className='bg-red-400 w30 mobile-product-card  flex justify-center items-center flex-wrap border-2 border-black  '>
                        <div className='w100 flex justify-center text-white font-black text-xl bg-green-500 my-5'>
                            <h1>Related Products</h1>
                        </div>
                        {
                        relatedProducts.length < 1 ? (noRelatedProducts()) : null
                        }
                        {
                        relatedProducts && relatedProducts.map((p,i)=>
                            (
                                <Card product={p}
                                key={i}
                                productwidth='w100'
                                details={false}
                                showviewproductbutton={true}
                                />
                            )
                        )
                        }
                    </div>
                
                </div>
        </Layout>
    )
}

export default Product