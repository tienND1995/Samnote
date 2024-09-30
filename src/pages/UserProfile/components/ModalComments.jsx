import React, { useState, useEffect, useContext } from 'react'
import api from '../../../api'
import { AppContext } from '../../../context'

const ModalComments = ({ idNote, setIsShowModalComments }) => {

    const [dataComments, setDataComments] = useState([])
    const [contentComment, setContentComment] = useState('')
    const appContext = useContext(AppContext)
    const { user } = appContext

    useEffect(() => {
        fetchAllDataComments()
    }, [])

    const fetchAllDataComments = async () => {
        try {
            const res = await api.get(`/notes/notes-comment/${idNote}`)
            setDataComments(res.data.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmitComment = async () => {
        try {
            const res = await api.post(`/notes/notes-comment/${idNote}`, {
                parent_id: false,
                sendAt: new Date().toISOString(),
                content: contentComment,
                idNote: idNote,
                idUser: user.id
            })
            setContentComment('')
            fetchAllDataComments()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <div className="modal-backdrop fade show" onClick={() => setIsShowModalComments(false)}></div>
            <div className="modal d-flex align-items-center justify-content-center pointer-events-none">
                <div className="modal-dialog-container w-[45rem] max-w-[70%] max-h-[90vh] pointer-events-auto">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Comments</h5>
                            <button type="button" className="btn-close" onClick={() => setIsShowModalComments(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="comments-list overflow-auto" style={{ maxHeight: '25rem' }}>
                                {dataComments.length > 0 ? (
                                    dataComments.map((comment) => (
                                        <div key={comment.id} className="d-flex mb-3">
                                            <img src={comment.avt} alt={comment.user_name} className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                                            <div>
                                                <div className='bg-gray-100 px-3 py-2 rounded-5'>
                                                    <h6 className="mb-0">{comment.user_name}</h6>
                                                    <p className="mb-0">{comment.content}</p>
                                                </div>
                                                <small className="text-muted ml-3">{new Date(comment.sendAt).toLocaleString()}</small>
                                            </div>
                                        </div>
                                    ))

                                ) : (
                                    <p className="text-center">No comments yet</p>
                                )}
                            </div>
                            <div className="flex flex-row gap-2 mt-3">
                                <textarea
                                    className="form-control"
                                    value={contentComment}
                                    onChange={(e) => setContentComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    rows={1}
                                />
                                <button className="btn btn-primary" onClick={handleSubmitComment}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalComments

