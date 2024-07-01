import React from "react";
import { UserOnline } from "../UserHideMessageReuse";
import "./index.css"
function SendMessageBox(props) {
    const ELementSendMessage = props.element.map((t) => {
        return (
            <div className="messageBoxAndUser">
                <div>
                    <img src={t.ImgUrl}></img>
                </div>
                <div className="message-box">
                    <div className="sendMessage">

                    </div>
                    <p>{t.comment}</p>
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

export default SendMessageBox;