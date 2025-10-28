import Image from 'next/image';
import img from '../../../public/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png'

const ProductCardSkleton = () => {
    return (
        <div className='p-2 animate-pulse w-full relative bg-white shadow'>
            <div className='h-36 lg:h-56 w-full overflow-hidden relative'>
                <div className='absolute z-30 bg-gradient-to-r from-orange-100 animate-pulse top-0 left-0 w-full h-full flex justify-center items-center'>
                    <Image src={img} className='w-16 md:w-20' alt="" /></div>
            </div>
            <p className='p-1 bg-slate-100 mt-3 rounded-full w-[80%]'></p>
            <p className='p-2 bg-slate-100 mt-2 rounded-full w-[50%]'></p>
            <p className='p-1 bg-slate-100 mt-2 rounded-full w-[60%] mb-4'></p>
        </div>
    );
};

export default ProductCardSkleton;