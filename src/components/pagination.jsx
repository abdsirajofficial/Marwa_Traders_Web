import { ChevronLeft, ChevronRight } from "lucide-react";


export default function Pagination({ currentPage, total, handlePageChange }) {
  return (
    <div className=' w-full' >
      {total <= 1 ? <div></div> :
        (<div className='flex justify-end px-10 mt-3 space-x-2'>
          {/* previous */}
          {currentPage != 1 &&
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className=' flex justify-center items-center'
            >
            <ChevronLeft />
              Prev
            </button>
          }

          {/* number */}
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? " bg-yellow-400 w-6 rounded-full" : ""}
            >
              {i + 1}
            </button>
          ))}
          
          {/* next */}
          {currentPage !== total ?
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === total} className=' flex justify-center items-center'
            >
              Next
              <ChevronRight/>
            </button> : <div className='w-10'></div>
          }

        </div>)
      }
    </div>
  )
}
