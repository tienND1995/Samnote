import React from "react";
import uniqid from 'uniqid';
import moment from 'moment'
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const ListResults = ({ results }) => {
    return (
        <div className="tab-pane active w-full">
            {
                results && results.map((item) => (
                    <div key={uniqid()} className="card mb-3 bg-transparent">
                        <div className="card-body d-flex justify-center p-0">
                            <div className="avatar mr-3">
                                <img src={item.avatar_user_create
                                    || item.linkAvatar
                                    || '/src/assets/avatar-default.png'
                                }
                                    alt={item.username_user_create}
                                    className="w-16 h-16 rounded-full"
                                />
                            </div>
                            <div className="content-wrapper w-[75%] bg-[#ffffff] px-3 py-2 rounded-2xl">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h5 className="card-title font-bold mb-0 truncate-text">
                                        {item.username_user_create || item.Name || 'Anonymous'}
                                    </h5>
                                    <small className="text-muted">
                                        {moment(item.createAt || item.sendAt).format('DD/MM/YYYY HH:mm')}
                                    </small>
                                </div>
                                <div className="card-text">
                                    <span className="font-bold">{item.title}</span>
                                    <div
                                        className="truncate-text overflow-hidden"
                                        style={{
                                            textOverflow: 'ellipsis', display: '-webkit-box',
                                            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                                            wordWrap: 'break-word', whiteSpace: 'pre-wrap'
                                        }}>
                                        <Markdown rehypePlugins={[rehypeRaw]}>
                                            {item.content || item.text || item.describe}
                                        </Markdown>
                                    </div>
                                </div>
                                {item.images && (
                                    <div className="image-gallery d-flex flex-wrap">
                                        {item.images.map((img) => (
                                            <img key={uniqid()}
                                                src={img} alt="Note image"
                                                className="img-thumbnail mr-2 mb-2"
                                                style={{ width: '6rem', height: '6rem', objectFit: 'cover' }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default ListResults;
