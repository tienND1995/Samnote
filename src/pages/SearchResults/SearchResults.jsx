import React, { useContext, useEffect, useState } from 'react'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import { AppContext } from '../../context'
import SearchIcon from '@mui/icons-material/Search';

const SearchResults = () => {
    const { user } = useContext(AppContext)
    const [searchText, setSearchText] = useState('a')
    const [activeTab, setActiveTab] = useState('everyone')
    const [results, setResults] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(5)

    useEffect(() => {
        fetchResults()
    }, [activeTab, currentPage])

    const fetchResults = async () => {
        let response
        switch (activeTab) {
            case 'everyone':
                response = await fetchApiSamenote(
                    'get',
                    `/notes_search?key=${searchText}`
                )
                console.log('everyone', response.search_note)
                setResults(response.search_note)
                break
            case 'anonymous':
                response = await fetchApiSamenote(
                    'get',
                    `/message/search_unknown_by_text/${user.id}/${searchText}`
                )
                console.log('anonymous', response.data)
                setResults(response.data)
                break
            case 'own':
                response = await fetchApiSamenote('get',
                    `/notes/${user.id}`
                )
                console.log('own', response.notes)
                setResults(response.notes)
                break
            case 'group':
                response = await fetchApiSamenote('get',
                    `/group/all/${user.id}`
                )
                console.log('group', response.data)
                setResults(response.data)
                break
        }
        if (response.total_pages) setTotalPages(response.total_pages)
    }

    const handleSearch = () => {
        setCurrentPage(1)
        fetchResults()
    }

    const renderResults = () => {
        return results.map((item, index) => (
            <div key={index} className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">{item.user_name}</h5>
                    <p className="card-text">{item.content}</p>
                    {item.images && item.images.map((img, imgIndex) => (
                        <img key={imgIndex} src={img} alt="Note image" className="img-thumbnail mr-2" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    ))}
                </div>
            </div>
        ))
    }

    return (
        <div className="search-container w-full bg-[#181A1B] overflow-auto">
            <div className='title-search flex justify-center items-end my-3'>
                <img
                    className='w-14 h-14 mr-2'
                    src='/src/assets/SearchResults.png'
                    alt="search-img"
                />
                <h2 className="text-white text-bottom">Search results</h2>
            </div>

            <div className="form-search w-[50%] m-auto relative bg-[#fff] rounded-pill">
                <input
                    type="text"
                    className="rounded-start-pill w-[95%] px-3 py-2"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <div className="absolute right-0 top-0 z-10 p-2 cursor-pointer"
                    onClick={handleSearch}>
                    <SearchIcon />
                </div>
            </div>

            <div className='content-container w-[95%] mx-auto my-5'>
                <ul className="nav nav-tabs flex bg-[#000000]">
                    {['everyone', 'anonymous', 'own', 'group'].map((tab) => (
                        <li className="nav-item flex-1 text-center" key={tab}>
                            <a
                                className={`nav-link text-white ${activeTab === tab ? 'active bg-[#F56852]' : ''}`}
                                href="#"
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'everyone' ? "Everyone's notes" :
                                    tab === 'anonymous' ? "Anonymous chat" :
                                        tab === 'own' ? "All your own" : "Group chat"}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="tab-content py-2 h-[60rem] relative"
                    style={{
                        backgroundImage: 'url(/src/assets/bg-search-results.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="tab-pane active">
                        {/* {renderResults()} */}
                    </div>
                    <nav
                        aria-label="Page navigation"
                        className='absolute top-[92%] w-full'
                    >
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</a>
                            </li>
                            {Array.from({ length: totalPages }, (_, number) => (
                                <li className={`page-item ${currentPage === number + 1 ? 'active' : ''}`} key={number}>
                                    <a className="page-link" href="#" onClick={() => setCurrentPage(number + 1)}>{number + 1}</a>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>


            </div>
        </div>
    )
}

export default SearchResults