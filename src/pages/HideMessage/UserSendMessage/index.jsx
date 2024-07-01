import React from "react";
import { UserOnline } from "../UserHideMessageReuse";
import "./index.css"
function SendMessageBoxUser(props) {
    const ELementSendMessage = props.element.map((t) => {
        return (
            <div className="messageBoxAndUserFromUser">
                <div className="message-box-FromUser">
                    <p>{t.comment}</p>
                </div>
                <div>
                    <img src={t.ImgUrl}></img>
                </div>
            </div>
        )
    })
    return (
        <div>
            {ELementSendMessage}
        </div>
    )
}

export default SendMessageBoxUser;