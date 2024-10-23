const MessageComponent = ({ data, renderItem }) => {
 return data.sort((a, b) => a.id - b.id).map((item) => renderItem(item))
}

export default MessageComponent
