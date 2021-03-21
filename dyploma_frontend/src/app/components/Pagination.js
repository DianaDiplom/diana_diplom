import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationCustom = ({pager, handleClick}) => {
	return (
		<Pagination size={'lg'} style={{justifyContent: 'center'}}>
			<Pagination.First onClick={() => handleClick(1)}/>
			<Pagination.Prev onClick={() => handleClick(pager.currentPage - 1)}/>
			{pager.currentPage > 5 && <Pagination.Item onClick={() => handleClick(1)}>{1}</Pagination.Item>}
			{pager.currentPage > 5 && <Pagination.Ellipsis disabled/>}

			{pager.currentPage > 2 && <Pagination.Item onClick={() => handleClick(pager.currentPage - 2)}>{pager.currentPage - 2}</Pagination.Item>}
			{pager.currentPage > 1 && <Pagination.Item onClick={() => handleClick(pager.currentPage - 1)}>{pager.currentPage - 1}</Pagination.Item>}
			<Pagination.Item active>{pager.currentPage}</Pagination.Item>
			{pager.currentPage < (pager.totalPages - 3) && 
                <Pagination.Item onClick={() => handleClick(pager.currentPage + 1)}>{pager.currentPage + 1}
                </Pagination.Item>}
			{pager.currentPage < (pager.totalPages - 3) && 
                <Pagination.Item onClick={() => handleClick(pager.currentPage + 2)}>{pager.currentPage + 2}
                </Pagination.Item>}
			{pager.currentPage < (pager.totalPages - 3) && <Pagination.Ellipsis disabled/>}
			{pager.currentPage !== pager.totalPages && 
                <Pagination.Item onClick={() => handleClick(pager.totalPages)}>{pager.totalPages}
                </Pagination.Item>}
			<Pagination.Next onClick={() => handleClick(pager.currentPage + 1)}/>
			<Pagination.Last onClick={() => handleClick(pager.totalPages)}/>
		</Pagination>
	);};

export default PaginationCustom;