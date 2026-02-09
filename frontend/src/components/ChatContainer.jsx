import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translateMessage } from "../lib/translationService";
import toast from "react-hot-toast";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import LanguageSelector from "./LanguageSelector";

// Default avatar as base64
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS11c2VyIj48cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg==";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const { selected: selectedLanguage, translations, setTranslation } = useLanguageStore();
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const translateMessages = async () => {
      if (selectedLanguage === 'en') return;
      setIsTranslating(true);

      try {
        for (const message of messages) {
          if (!translations[message._id] && message.text) {
            const result = await translateMessage(message.text, selectedLanguage);
            setTranslation(message._id, result.translatedText);
          }
        }
      } catch (error) {
        console.error('Translation error:', error);
        toast.error('Failed to translate messages');
      } finally {
        setIsTranslating(false);
      }
    };

    translateMessages();
  }, [messages, selectedLanguage, setTranslation, translations]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="flex justify-between items-center">
        <ChatHeader />
        <div className="px-4">
          <LanguageSelector />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser?.profilePic || DEFAULT_AVATAR
                      : selectedUser?.profilePic || DEFAULT_AVATAR
                  }
                  alt="profile pic"
                  className="bg-base-200"
                  onError={(e) => {
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && (
                <>
                  <p>{translations[message._id] || message.text}</p>
                  {translations[message._id] && selectedLanguage !== 'en' && (
                    <p className="text-xs opacity-50 mt-1">Original: {message.text}</p>
                  )}
                </>
              )}
            </div>
            {isTranslating && (
              <div className="chat-footer opacity-50">
                <span className="text-xs">Translating...</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
