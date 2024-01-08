import { Icon, Pagination } from 'semantic-ui-react'
import './pagination.css'


const GalleryPagination = ({activePage,totalPages,onPageChange}) => {
  return (
    <Pagination className="gallery-pagination"
      ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
      firstItem={{ content: <Icon name='angle double left' />, icon: true }}
      lastItem={{ content: <Icon name='angle double right' />, icon: true }}
      prevItem={{ content: <Icon name='angle left' />, icon: true }}
      nextItem={{ content: <Icon name='angle right' />, icon: true }}
      activePage={activePage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      style={{backgroundColor: '#171717'}}
    />
  )
}

export default GalleryPagination