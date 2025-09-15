import { useEffect, useState } from "react";
import styled from "styled-components";
import MessageForm from "./components/MessageForm";
import MessageItem from "./components/MessageItem";
import GlobalStyle from "./styles/GlobalStyle";
import Footer from "./components/Footer";
import AuthForm from "./components/AuthForm";
import UserHeader from "./components/UserHeader";



const StyledCard = styled.div`
  background-color: #dfdada;
  border: 1px solid #0e0d0d;
  box-shadow: 4px 4px black;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 320px;
  padding: 10px;
  width: 100%;
  margin: auto;
  box-sizing: border-box;
`

const MessageList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin: 20px auto;
  max-width: 320px;
  max-height: 80vh;  
  overflow-y: auto;  
  padding-right: 10px;
  border: 1px solid #aaa;
  background-color: #f8f8f8;
  box-sizing: border-box;
`

const LoginPrompt = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f0f8ff;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 10px auto;
  max-width: 320px;

  p {
    margin-bottom: 15px;
    color: #555
  }

  button {
    padding: 10px 20px;
    background-color: #f78a8a;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
  }
  `
//"https://happy-thoughts-api-4ful.onrender.com/thoughts"

export const App = () => {
  const API_URL = "https://lillebrorgrodas-first-api.onrender.com/thoughts"
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [messageText, setMessageText] = useState("")
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userId = localStorage.getItem('userId')
    if (token && userId) {
      setUser({ accessToken: token, userId })
    }
  }, [])

  const fetchMessages = () => {
    setIsLoading(true);
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data.response)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching messages:", error)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  //Handle the liking of posts
  const handleLike = (id) => {
    fetch(`${API_URL}/${id}/like`, {
      method: "POST"
    })
      .then(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === id ? { ...msg, hearts: msg.hearts + 1 } : msg
          )
        )
      })
      .catch((error) => console.error("Error liking message:", error))
  }

  const handleMessageSubmit = (event) => {
    event.preventDefault()

    if (!user) {
      setShowAuth(true)
      return
    }

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.accessToken,
      },
      body: JSON.stringify({ message: messageText, createdBy: user.userId }),
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired. Please log in again.")
          handleLogout()
          throw new Error("Unauthorized")
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          fetchMessages()
          setMessageText("")
        }
      })
      .catch((error) => console.error("Error posting message:", error))
  }

  const handleAuthSuccess = (authData) => {
    setUser(authData)
    setShowAuth(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userId")
    setUser(null)
    setShowAuth(false)
  }

  const handleLoginPrompt = () => {
    setShowAuth(true)
  }



  return (
    <>
      <GlobalStyle />
      {user && <UserHeader user={user} onLogout={handleLogout} />}
      <h1>Happy Thoughts</h1>

      {showAuth ? (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      ) : (<>
        {user ? (
          <StyledCard>
            <MessageForm
              messageText={messageText}
              setMessageText={setMessageText}
              onSubmit={handleMessageSubmit}
            />
          </StyledCard>
        ) : (
          <LoginPrompt>
            <p>Please log in to post your happy thoughts!</p>
            <button onClick={handleLoginPrompt}>Log In / Register</button>
          </LoginPrompt>
        )}
      </>)}


      <MessageList>
        {isLoading ? (
          <p>Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageItem
              key={message._id}
              text={message.message}
              likes={message.hearts}
              createdAt={message.date}
              onLike={() => handleLike(message._id)}
              isNewest={index === 0}
            />
          ))
        ) : (
          <p>No messages yet. Be the first to post!</p>
        )}
      </MessageList>
      <Footer />

    </>
  )
}