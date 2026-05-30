import React, { useState, useEffect } from 'react';
import { getAllSalesData } from '../services/api';
import './HistoryTable.css';


function HistoryTable({ refreshTrigger }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchData = async (page) => {
        setLoading(true);
        try {
            const response = await getAllSalesData(page, 100);
            setData(response.data.data);
            setTotalPages(response.data.pagination.total_pages);
            setTotalRecords(response.data.pagination.total_records);
            setCurrentPage(response.data.pagination.current_page);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, refreshTrigger]);


    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className='table-container'>
            <div className="table-header">
                <h3> Detailed Data </h3>
                <span className="record-count"> Total: {totalRecords} rows</span>
            </div>

            {loading ? (
                <div className="loading-state"> Fetching data... </div>
            ) : (
                <div className="table-wrapper">
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th>Ngay Nhap</th>
                                <th>Ma ST</th>
                                <th>SKU</th>
                                <th>Ten Hang</th>
                                <th>Ma NCC</th>
                                <th>So luong</th>
                                <th>TT Ban</th>
                                <th>TT VAT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.ngay_giao_dich}</td>
                                        <td>{row.ma_st}</td>
                                        <td>{row.sku}</td>
                                        <td className="item-name">{row.ten_hang}</td>
                                        <td>{row.ma_ncc}</td>
                                        <td className="text-right">{row.sl}</td>
                                        <td className="text-right">{row.tt_ban.toLocaleString('vi-VN')}</td>
                                        <td className="text-right">{row.tt_vat.toLocaleString('vi-VN')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="empty-state">No data.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
                        &laquo; Previous page
                    </button>
                    <span>Page #: {currentPage} / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>
                        &laquo; Next page
                    </button>
                </div>
            )}
        </div>
    )
}

export default HistoryTable;