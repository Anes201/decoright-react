

// ChatView.tsx (presentational)

import { useOutletContext } from 'react-router-dom';
import ChatHeader from '@components/chat/ChatHeader';
import ChatBody from '@components/chat/ChatBody';
import ChatForm from '@components/chat/ChatForm';


export default function ChatRoom(){
    const { selectedRequest } = useOutletContext<{ selectedRequest: any }>();

    return (
        <>
            <ChatHeader request={selectedRequest}/>
            <ChatBody request={selectedRequest} />
            <ChatForm request={selectedRequest}/>
        </>
    )
}
