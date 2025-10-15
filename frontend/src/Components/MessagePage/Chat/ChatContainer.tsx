import { useEffect, useRef } from 'react';
import useStore from '@/hooks/useStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './MessageSkeleton';
import { formatMessageTime } from '@/utils/timeFormat';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    loggedInMember,
    _hasHydrated,
    subscribeToMessages,
  } = useStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (_hasHydrated && selectedUser?._id && loggedInMember?._id) {
      getMessages(selectedUser._id)
        .then(() => {
          subscribeToMessages();
        })
        .catch((err) => console.error('ChatContainer: Fetch error:', err));
    }
  }, [_hasHydrated, selectedUser?._id, loggedInMember?._id, getMessages, subscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }
  }, [messages]);

  const decodeHtml = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const linkifyText = (text) => {
    const decoded = decodeHtml(text);
    const urlRegex = /\b((https?:\/\/|www\.)[^\s]+)/gi;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(decoded)) !== null) {
      const { index } = match;
      const url = match[0];

      if (index > lastIndex) {
        parts.push(decoded.slice(lastIndex, index));
      }

      const href = url.startsWith('http') ? url : `https://${url}`;
      parts.push(
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className=" underline break-words"
        >
          {url}
        </a>
      );

      lastIndex = index + url.length;
    }

    if (lastIndex < decoded.length) {
      parts.push(decoded.slice(lastIndex));
    }

    return parts;
  };

  if (!selectedUser)
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a user to start chatting
      </div>
    );
  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto ">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground">No messages yet</div>
        ) : (
          messages.map((message, index) => {
            const isMine = String(message.senderId) === String(loggedInMember?._id);
            const ref = index === messages.length - 1 ? messageEndRef : null;

            return (
              <div
                key={message._id}
                className={`w-full flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                {!isMine && (
                  <img
                    src={selectedUser?.photo?.url}
                    alt="profile"
                    className="w-8 h-8 rounded-full border object-cover mr-2 self-end"
                  />
                )}
                <div
                  className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2 shadow-sm ${
                    isMine
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}
                  ref={ref}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="w-full max-h-48 object-cover rounded-lg mb-2"
                    />
                  )}
                  {message.text && (
                    <p className="text-sm break-words whitespace-pre-wrap text-left">
                      {linkifyText(message.text)}
                    </p>
                  )}
                  <span className="block text-xs text-muted-foreground mt-1 text-right">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
                {isMine && (
                  <img
                    src={loggedInMember?.photo?.url}
                    alt="me"
                    className="w-8 h-8 rounded-full border object-cover ml-2 self-end"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messageEndRef}></div>
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
