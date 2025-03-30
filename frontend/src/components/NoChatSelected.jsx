import { MessageSquare } from "lucide-react";

export const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">

        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 bg-slate-300 rounded-3xl flex items-center justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-orange-950" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl text-slate-700 font-bold">Welcome to Chatty!</h2>
        <p className="text-base-content/60 text-slate-500">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};