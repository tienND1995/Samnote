import React from "react";
import uniqid from 'uniqid';

const ListResults = ({ results }) => {
    return results.map((item) => (
        <div key={uniqid()} className="card mb-3">
            <div className="card-body d-flex">
                <div className="avatar mr-3">
                    <img src={item.avatar} alt="User avatar" className="rounded-circle" style={{ width: '50px', height: '50px' }} />
                </div>
                <div className="content-wrapper flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title mb-0">{item.user_name}</h5>
                        <small className="text-muted">{item.timestamp}</small>
                    </div>
                    <p className="card-text">{item.content}</p>
                    {item.images && (
                        <div className="image-gallery d-flex flex-wrap">
                            {item.images.map((img) => (
                                <img key={uniqid()} src={img} alt="Note image" className="img-thumbnail mr-2 mb-2" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ));
};

export default ListResults;
