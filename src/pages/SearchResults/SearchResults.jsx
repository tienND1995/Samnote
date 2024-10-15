import React, { useContext, useEffect, useState, useReducer } from 'react'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import { AppContext } from '../../context'
import SearchIcon from '@mui/icons-material/Search';
import ListResults from './ListResults';
import Pagination from './Pagination';

const SearchResults = () => {
    const { user } = useContext(AppContext)
    const [searchText, setSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('everyone')
    const [results, setResults] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        fetchResults()
    }, [activeTab, currentPage])

    const fetchResults = async () => {
        if (searchText.trim() === '') {
            setResults([])
            return
        }
        setResults([])
        let response
        switch (activeTab) {
            case 'everyone':
                response = await fetchApiSamenote(
                    'get',
                    `/public_notes_search?key=${searchText}&page=${currentPage}`
                )
                console.log('everyone', response.search_note)
                setResults(response.search_note)
                break
            case 'anonymous':
                response = await fetchApiSamenote(
                    'get',
                    `/message/search_unknown_by_text/${user.id}/${searchText}?page=${currentPage}`
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
        if (response.number_page) setTotalPages(Math.ceil(response.number_page))
    }

    const handleSearch = () => {
        setCurrentPage(1)
        fetchResults()
    }

    return (
        <div className="search-container w-full bg-[#181A1B] overflow-auto">
            <div className='title-search flex justify-center items-end my-3'>
                <img
                    className='w-14 h-14 mr-2'
                    src='/src/assets/SearchResults.png'
                    alt="search-img"
                />
                <h2 className="text-white text-4xl text-bottom">Search results</h2>
            </div>

            <div className="flex justify-center w-full">
                <div className="form-search w-[50%] relative bg-[#fff] rounded-pill">
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
            </div>

            <div className='content-container w-[95%] mx-auto my-5'>
                <ul className="nav nav-tabs flex bg-[#000000]">
                    {['everyone', 'anonymous', 'own', 'group'].map((tab) => (
                        <li className="nav-item flex-1 text-center cursor-pointer" key={tab}>
                            <a
                                className={`nav-link text-white text-xl ${activeTab === tab ? 'active bg-[#F56852]' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'everyone' ? "Everyone's notes" :
                                    tab === 'anonymous' ? "Anonymous chat" :
                                        tab === 'own' ? "All your own" : "Group chat"}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="tab-content py-3 min-h-[40rem]"
                    style={{
                        backgroundImage: 'url(/src/assets/bg-search-results.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <ListResults results={results} />
                    {totalPages > 1 &&
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchResults