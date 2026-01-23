
// ChatView.tsx (presentational)
import useAuth from "@/hooks/useAuth";
import ChatList from '@components/chat/ChatList';
import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RequestService } from '@/services/request.service';
import { ICONS } from '@/icons';


export default function ChatLayout() {

  const { user } = useAuth();
  const { id: requestIdFromUrl } = useParams<{ id: string }>();
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [RequestsLoading, setRequestsLoading] = useState(true);

  // Fetch all requests for the current user
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await RequestService.getMyRequests();
        setRequests(data);

        // If there's an ID in the URL, set it as selected
        if (requestIdFromUrl) {
          const found = data.find(r => r.id === requestIdFromUrl);
          if (found) setSelectedRequest(found);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setRequestsLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user, requestIdFromUrl]);

  return (
    <div className="flex gap-4 w-full h-full">

      <div className={`${requestIdFromUrl && 'max-md:hidden'} flex flex-col gap-2 md:gap-4 w-full lg:w-2/3 xl:w-1/3 h-full p-2 md:p-4 border border-muted/15 bg-surface rounded-2xl`}>
        <h3 className="font-medium text-sm p-2.5 border border-muted/15 rounded-lg"> Requests </h3>
        <ChatList requests={requests} selectedRequest={selectedRequest} RequestsLoading={RequestsLoading} />
      </div>
      <div className={`${!requestIdFromUrl && 'max-md:hidden'} flex flex-col w-full h-full p-2 sm:p-4 border border-muted/15 bg-surface rounded-2xl`}>
        { requestIdFromUrl && selectedRequest
          ?
          // ChatRoom Outlet
          <Outlet context={{selectedRequest}} />

          :
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <div className="p-6 rounded-full bg-primary/5 mb-6">
              <ICONS.chatBubbleOvalLeftEllipsis className="size-16 text-primary/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2"> Select a Request </h3>
            <p className="text-muted text-sm max-w-xs"> Choose one of your service requests from the list to view its chat history and send messages. </p>
          </div>
        }
      </div>
    </div>
  );
}
