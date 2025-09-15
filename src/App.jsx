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
const ErrorMessage = styled.div`
  background-color: #ffe6e6;
  border: 1px solid #ff9999;
  color: #cc0000;
  padding: 10px;
  border-radius: 5px;
  margin: 10px auto;
  max-width: 320px;
  text-align: center;
`

const SuccessMessage = styled.div`
  background-color: #e6ffe6;
  border: 1px solid #99ff99;
  color: #006600;
  padding: 10px;
  border-radius: 5px;
  margin: 10px auto;
  max-width: 320px;
  text-align: center;
`


export const App = () => {
  const API_URL = "https://lillebrorgrodas-first-api.onrender.com/thoughts"
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [messageText, setMessageText] = useState("")
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [category, setCategory] = useState("Other")

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])


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
        setMessages(data.response || [])
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
      body: JSON.stringify({
        message: messageText,
        category: category,
        createdBy: user.userId
      }),
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
          setCategory("Other")
          setSuccess("Message posted successfully!")
        }
      })
      .catch((error) => console.error("Error posting message:", error))
  }

  const handleEditThought = async (thoughtId, updatedData) => {
    if (!user) return false

    try {
      const response = await fetch(`${API_URL}/${thoughtId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.accessToken,
        },
        body: JSON.stringify(updatedData),
      })
      if (response.status === 401) {
        setError("Session expired. Please log in again.")
        handleLogout()
        return false
      }
      if (response.status === 403) {
        setError("You are not authorized to edit this thought.")
        return false
      }
      if (!response.ok) {
        throw new Error("Failed to edit thought")
      }

      await fetchMessages()
      setSuccess("Thought updated successfully!")
      return true
    } catch (error) {
      console.error("Error editing thought:", error)
      setError("An error occurred while editing the thought.")
      return false
    }

  }

  const handleDeleteThought = async (thoughtId) => {
    if (!user) return
    try {
      const response = await fetch(`${API_URL}/${thoughtId}`, {
        method: "DELETE",
        headers: {
          Authorization: user.accessToken,
        },
      })

      const data = await response.json()

      if (response.status === 401) {
        setError("Session expired. Please log in again.")
        handleLogout()
        return
      }
      if (response.status === 403) {
        setError(data.message || "You are not authorized to delete this thought.")
        return
      }

      if (response.status === 404) {
        setError(data.message || "Thought not found.")
        return
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete thought")
      }
      await fetchMessages()
      setSuccess("Thought deleted successfully!")
    } catch (error) {
      console.error("Error deleting thought:", error)
      setError("An error occurred while deleting the thought.")
    }
  }

  const handleAuthSuccess = (authData) => {
    setUser(authData)
    setShowAuth(false)
    setSuccess("Successfully logged in!")
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userId")
    setUser(null)
    setShowAuth(false)
    setSuccess("Successfully logged out!")
  }

  const handleLoginPrompt = () => {
    setShowAuth(true)
  }



  return (
    <>
      <GlobalStyle />
      {user && <UserHeader user={user} onLogout={handleLogout} />}
      <h1>Happy Thoughts</h1>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {showAuth ? (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      ) : (<>
        {user ? (
          <StyledCard>
            <MessageForm
              messageText={messageText}
              setMessageText={setMessageText}
              onSubmit={handleMessageSubmit}
              category={category}
              setCategory={setCategory}

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
              thought={message}
              user={user}
              onEdit={handleEditThought}
              onDelete={handleDeleteThought}
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