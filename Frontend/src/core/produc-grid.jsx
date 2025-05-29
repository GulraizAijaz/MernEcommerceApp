import Card from "./Card"
const productGrid = ({products})=>{
    return(
        <div className='flex justify-center flex-wrap products-wrap'>
            {products && products.length > 0 ? products.map((product,i)=>(
                <Card productwidth="default_card_width" product={product} key={i}/>
            )):null}
        </div>  
    )
}
export default productGrid



