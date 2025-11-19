import React from "react"
import "./Search.css"
function Search({ search, setSearch, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(search) // Gọi hàm tìm kiếm từ parent component
    }
  }
  return (
    <div className="container search">
      <div className="row inner-search">
        <div className="inner-wrap-search col-xl-12 col-lg-12 col-sm-12 col-12 d-flex justify-content-between">
          <form
            className="form-search"
            onSubmit={handleSubmit}
          >
            <div className="search-box">
              <input
                className="form-control"
                type="search"
                placeholder="Search Customer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Search
