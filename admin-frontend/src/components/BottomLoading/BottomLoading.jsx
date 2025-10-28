import logo from '../../assets/logo/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png'
const BottomLoading = ({ loading }) => {
    return (
        <div className='flex justify-center'>
            {loading && <img className='w-16 bg-white rounded-full shadow-md mt-4 animate-pulse' src={logo} alt="" />}
        </div>
    );
};

export default BottomLoading;