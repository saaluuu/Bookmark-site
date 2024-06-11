import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarksPerPage] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    const userBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${loggedInUser.username}`)) || [];
    setBookmarks(userBookmarks);
  }, [navigate]);

  const handleAddBookmark = () => {
    if (bookmarks.length >= 5) {
      setError('You can only add up to 5 bookmarks.');
      return;
    }
    const newBookmark = { url, title, time: new Date().toLocaleString() };
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    localStorage.setItem(`bookmarks_${loggedInUser.username}`, JSON.stringify(updatedBookmarks));
    setUrl('');
    setTitle('');
    setError('');
  };

  const handleDeleteBookmark = (index) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
      setBookmarks(updatedBookmarks);
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      localStorage.setItem(`bookmarks_${loggedInUser.username}`, JSON.stringify(updatedBookmarks));
    }
  };

  const handleEditBookmark = (index) => {
    setEditingIndex(index);
    setUrl(bookmarks[index].url);
    setTitle(bookmarks[index].title);
  };

  const handleUpdateBookmark = () => {
    const updatedBookmarks = bookmarks.map((bookmark, index) => {
      if (index === editingIndex) {
        return { ...bookmark, url, title };
      }
      return bookmark;
    });
    setBookmarks(updatedBookmarks);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    localStorage.setItem(`bookmarks_${loggedInUser.username}`, JSON.stringify(updatedBookmarks));
    setEditingIndex(null);
    setUrl('');
    setTitle('');
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination 
  const indexOfLastBookmark = currentPage * bookmarksPerPage;
  const indexOfFirstBookmark = indexOfLastBookmark - bookmarksPerPage;
  const currentBookmarks = filteredBookmarks.slice(indexOfFirstBookmark, indexOfLastBookmark);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bookmarks-container">
      <h2>My Bookmarks</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      {editingIndex === null ? (
        <button onClick={handleAddBookmark}>Add Bookmark</button>
      ) : (
        <button onClick={handleUpdateBookmark}>Update Bookmark</button>
      )}
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <div className="bookmark-list">
        {currentBookmarks.map((bookmark, index) => (
          <div key={index} className="bookmark-item">
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              {bookmark.title}
            </a>
            <p>Added on: {bookmark.time}</p>
            <button onClick={() => handleEditBookmark(index)}>Edit</button>
            <button onClick={() => handleDeleteBookmark(index)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredBookmarks.length / bookmarksPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookmarksPage;
