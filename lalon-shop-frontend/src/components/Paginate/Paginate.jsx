import React from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


const Paginate = ({ setPage, totalPage }) => {
    return (
        <div className={`${totalPage < 2 && 'hidden'} `}>
            <ReactPaginate
                containerClassName="flex justify-center max-w-[516px] w-full items-center  gap-3 mx-auto overflow-hidden mt-10 "
                breakLabel="..."
                onPageChange={(data) => setPage(data.selected + 1)}
                activeClassName="bg-main text-white"
                pageRangeDisplayed={3}
                pageClassName='rounded-full overflow-hidden'
                pageCount={totalPage}
                previousLabel={<IoIosArrowBack />}
                nextLabel={<IoIosArrowForward />}
                pageLinkClassName='w-8 h-8 flex justify-center items-center font-medium rounded-full rounded-full'
                previousLinkClassName='bg-gray-200  me-4 w-10 py-1 rounded flex justify-center items-center  font-medium'
                nextLinkClassName='bg-gray-200 w-10 py-1 rounded flex justify-center items-center  font-medium'
                renderOnZeroPageCount={null}
            />
        </div>
    );
};

export default Paginate;