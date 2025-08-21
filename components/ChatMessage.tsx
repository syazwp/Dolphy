
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const RobotIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-slate-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2a2 2 0 0 1 2 2v2h-4V4a2 2 0 0 1 2-2zM8 8V6h8v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2zm4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-4 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
  </svg>
);

const UserIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-sky-200"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-3 my-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
          <RobotIcon />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg lg:max-w-xl rounded-2xl px-4 py-3 shadow ${
          isModel
            ? 'bg-white text-gray-800 rounded-tl-none'
            : 'bg-sky-500 text-white rounded-br-none'
        }`}
      >
        <p className="text-sm break-words">{message.text}</p>
      </div>
      {!isModel && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
         <UserIcon />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
