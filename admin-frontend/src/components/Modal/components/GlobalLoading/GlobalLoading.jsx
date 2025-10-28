
import logo from '../../../../assets/logo/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png';
// eslint-disable-next-line react-refresh/only-export-components
export const toggleGlobalLoading = (e) => {
    const parent = document.getElementById('global-loading-parent')
    const child = document.getElementById('global-loading')
    if (e === 'open') {
        parent.classList.remove('hidden')
        child.classList.remove('scale-0')
        child.classList.remove('opacity-0')
        child.classList.add('scale-100')
        child.classList.add('opacity-100')
    }
    else {
        parent.classList.add('hidden')
        child.classList.add('scale-0')
        child.classList.add('opacity-0')
        child.classList.remove('scale-100')
        child.classList.remove('opacity-100')
    }
}


const GlobalLoading = () => {
    return (
        <>

            <div id="global-loading-parent" className="fixed hidden top-0 left-0 w-full h-full overflow-hidden backdrop-blur-sm bg-[#00000025] z-[1000000]"></div>

            <div id={'global-loading'} className="select-none max-w-[420px] fixed  p-8 top-[50%] scale-0 opacity-0 left-2/4 -translate-x-2/4 duration-500  w-full -translate-y-2/4 z-[10000000]">
                <img src={logo} className='w-20 h-20 lg:w-24 lg:h-24 mx-auto  animate-pulse   rounded-full' alt="" />
            </div>

        </>
    );
};

export default GlobalLoading;