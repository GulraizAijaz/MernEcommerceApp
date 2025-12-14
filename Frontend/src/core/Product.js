import { useState,useEffect } from 'react'
import Layout from "./Layout"
import { readSingleProduct,listRelated } from './apiCore'
import Card from './Card'
import { useParams } from 'react-router-dom';
import Loading from '../core/loading'
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
        <Loading/>
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
        <Layout title={`product (${product.product ? product.product.name : "name"})`} description="Product Full Details"className=''>
                <div className='p-2 w100 flex  justify-between '>
                    <div className='w70 px-2 mobile-product-card  flex justify-center items-start self-start'>
                        {product.product ? 
                        <Card product={product.product}
                        productwidth='w100'
                        details={true}
                        showviewproductbutton={false}
                        
                        />
                        :
                        (loadingProduct())
                        }
                    </div>
                    <div className='w30 mobile-product-card  flex justify-center items-center flex-wrap border-2 border-black  related_heading'>
                        <div className='w100 flex justify-center text-white font-black text-xl  my-5 related_heading_inner'>
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