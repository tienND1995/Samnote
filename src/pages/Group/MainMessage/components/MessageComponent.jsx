const MessageComponent = ({ data, renderItem }) => {
 return data.map((item) => renderItem(item))
}

export default MessageComponent
