import React from "react";
export const UserOnline = (props) => {
    const { ImgUrl, name , comment} = props
    return (
        <div>
        {ImgUrl} - {name} - {comment} 
    </div>
    )
}