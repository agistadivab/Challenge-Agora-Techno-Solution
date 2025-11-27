import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const DataTableWidget = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        // Hanya ambil 100 data
        setPosts(data.slice(0, 100)); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

    setCurrentPage(1); 
  };

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.userId.toString().includes(query) ||
      post.id.toString().includes(query)
    );
  });
  
  // --- Export Functions ---

  const exportToExcel = () => {
    setExportLoading(true);
    
    try {
      const excelData = filteredPosts.map((post, index) => ({
        'No': index + 1,
        'User ID': post.userId,
        'Post ID': post.id,
        'Title': post.title,
        'Content': post.body,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      const colWidths = [
        { wch: 5 }, { wch: 8 }, { wch: 8 }, { wch: 40 }, { wch: 50 },
      ];
      ws['!cols'] = colWidths;
      
      if (!ws['!merges']) ws['!merges'] = [];
      if (!ws['!rows']) ws['!rows'] = [];
      
      ws['!rows'][0] = { hpt: 25, hpx: 30 };
      
      XLSX.utils.book_append_sheet(wb, ws, 'User Posts Data');
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `user_posts_data_${timestamp}.xlsx`;
      
      XLSX.writeFile(wb, filename);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting data to Excel. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const exportCurrentPageToExcel = () => {
    setExportLoading(true);
    
    try {
      const currentItemsToExport = filteredPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      const excelData = currentItemsToExport.map((post, index) => ({
        'No': (currentPage - 1) * itemsPerPage + index + 1,
        'User ID': post.userId,
        'Post ID': post.id,
        'Title': post.title,
        'Content': post.body,
        'Page': `Page ${currentPage}`
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      const colWidths = [
        { wch: 5 }, { wch: 8 }, { wch: 8 }, { wch: 40 }, { wch: 50 }, { wch: 8 },
      ];
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, `Page ${currentPage} Data`);
      XLSX.writeFile(wb, `user_posts_page_${currentPage}.xlsx`);
      
    } catch (error) {
      console.error('Error exporting current page:', error);
      alert('Error exporting current page data.');
    } finally {
      setExportLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem); 
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage); 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getVisiblePageNumbers = () => {
    const totalVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(totalVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);
    
    if (endPage - startPage + 1 < totalVisiblePages) {
      startPage = Math.max(1, endPage - totalVisiblePages + 1);
    }
    
    return pageNumbers.slice(startPage - 1, endPage);
  };
  
  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Data Table</h2>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-500 font-medium">Loading data...</div>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Main Component ---
  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Posts Data</h2>
        
        {/* Kontainer baru untuk Search dan Export */}
        <div className="flex items-center space-x-4"> 
          
          {/* Search Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-64 shadow-sm"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          {/* Export Dropdown Menu (tanpa advanced) */}
          <div className="relative group">
            <button 
              disabled={exportLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-md ${
                exportLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {exportLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  <span>Export</span>
                </>
              )}
            </button>
            
            {/* Dropdown Content */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 transform scale-95 group-hover:scale-100 origin-top-right">
              <div className="py-1">
                <button
                  onClick={exportToExcel}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <span>Export All Data</span>
                </button>
                
                <button
                  onClick={exportCurrentPageToExcel}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <span>Export Current Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabel Data */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Post ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Content Preview
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentItems.map((post, index) => (
              <tr 
                key={post.id} 
                className={`transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50`}
              >
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <div className="flex items-center">

                    <span className="text-sm font-medium text-gray-900">
                      User {post.userId}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    #{post.id}
                  </span>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-900 max-w-xs">
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <div className="text-sm text-gray-700 max-w-md leading-relaxed">
                    {post.body.substring(0, 80)}...
                  </div>
                </td>
              </tr>
            ))}
            {filteredPosts.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-500 text-lg">
                  No results found for "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-800">{filteredPosts.length > 0 ? indexOfFirstItem + 1 : 0}</span> to{' '}
          <span className="font-semibold text-gray-800">
            {Math.min(indexOfLastItem, filteredPosts.length)}
          </span> of{' '}
          <span className="font-semibold text-gray-800">{filteredPosts.length}</span> results 
          {/* Tampilkan total asli jika ada filter */}
          {searchQuery && (
            <span className="ml-2 text-xs text-blue-600">
              (Total all data: {posts.length})
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button 
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium transition-colors shadow-sm ${
              currentPage === 1 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {getVisiblePageNumbers().map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === number
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-50 border border-gray-300'
                }`}
              >
                {number}
              </button>
            ))}
            
            {/* Ellipsis for many pages */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
            )}
          </div>

          {/* Next Button */}
          <button 
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium transition-colors shadow-sm ${
              currentPage === totalPages 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Next
            <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      {/* Page Info */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">
          Page <span className="font-medium text-gray-700">{currentPage}</span> of <span className="font-medium text-gray-700">{totalPages}</span>
        </span>
      </div>
    </div>
  );
};

export default DataTableWidget;