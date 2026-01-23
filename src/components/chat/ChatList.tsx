
// ChatList.tsx (small presentational)
import Spinner from "@components/common/Spinner";
import { ICONS } from "@/icons";
import { PATHS } from "@/routers/Paths";
import { NavLink } from "react-router-dom";

export default function ChatList({requests, selectedRequest, RequestsLoading}:any) {

  return (
    <ul className="space-y-2 overflow-y-auto min-scrollbar">

      {RequestsLoading ? (
      <li className="flex flex-col gap-2p-4 text-center text-xs">
        <Spinner size="sm" status={RequestsLoading} />
        <span>Loading requests...</span>
      </li>

      ) : requests.length > 0 ? (
        requests.map((request: any) => (
          <li key={request.id}
          className={`w-full rounded-lg hover:bg-surface border border-muted/10 hover:border-muted/15 overflow-hidden ${selectedRequest?.id === request.id ? 'bg-surface ring-1 ring-primary/20' : 'bg-surface/45'}`}>
            <NavLink to={PATHS.CLIENT.chatRoom(request.id)} className="flex items-center gap-2 w-full h-fit p-2">
              {/* Avatar */}
              <div className="h-fit w-12 aspect-square rounded-full border border-muted/45 overflow-hidden bg-emphasis flex items-center justify-center">
                <ICONS.pencilSquare className="size-6 text-muted" />
              </div>

              {/* Context */}
              <div className="flex flex-col w-full h-fit">
                <h3 className="font-medium text-sm"> {request.request_code} </h3>
                <p className="text-2xs text-muted"> {(request.service_type || 'Unknown').replace(/_/g, ' ')} </p>
                <span className="text-2xs text-muted"> {new Date(request.created_at).toLocaleDateString()} </span>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-full text-2xs ${request.status === 'Completed' ? 'bg-success/10 text-success' :
                  request.status === 'Cancelled' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                  }`}>
                  {request.status}
                </span>
              </div>
            </NavLink>
          </li>
        ))
      ) : (
        <li className="p-4 text-center text-xs text-muted">No requests found</li>
      )}
    </ul>
  );
}
