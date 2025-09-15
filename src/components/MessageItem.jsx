import { useState, useEffect } from "react"
import styled, { keyframes, css } from "styled-components"
import EditModal from "./EditModal"

const flare = keyframes`
  0% {opacity: 0; transform: scale(0.5) rotate(0deg);}
  50% {opacity: 1; transform: scale(1.2) rotate(45deg);}
  100% {opacity: 0; transform: scale(0.5) rotate(90deg);}
`

const StyledMessageItem = styled.div`
  background: #faf8f8;
  border: 1px solid #0e0d0d;
  box-shadow: 4px 4px black;
  padding: 10px;
  width: 250px;
  position: relative;
  margin-top: 10px;
  word-break: break-word;
`
const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`
const AuthorInfo = styled.div`
font-size: 0.8rem;
color: #666;
font-style: italic ;
`
const ActionButtons = styled.div`
  display: flex;
  gap: 5px;
  button {
    padding: 5px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.edit {
      background-color: #87ceeb;
      &:hover { background-color: #4682b4; }
    }
    &.delete {
      background-color: #ffb6c1;
      &:hover { background-color: #ff69b4; }
    }
  }
`

const FlareIcon = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 1.5rem;
  opacity: 0;
  ${({ $show }) =>
    $show &&
    css`
      animation: ${flare} 1.5s ease-out;
      opacity: 1;
    `}
`
const StyledButton = styled.button`
    padding: 10px;
    cursor: pointer;
    border-radius: 50%;
    background-color: ${(props) => (props.$hasLiked ? "#f78a8a" : "#ccc")} ;
    border: none;
    margin-right: 5px;
  `
const StyledLikeContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
    font-size: 0.8rem;
    color: #555;
  `

const CategoryTag = styled.span`
  background-color: #e0e0e0;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  color: #666;
  margin-left: 10px;
`


// Function to format the time difference
// from the current time to the message's createdAt timestamp
const timeAgo = (timestamp) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}


const MessageItem = ({
  text,
  createdAt,
  isNewest,
  likes,
  onLike,
  thought,
  user,
  onEdit,
  onDelete
}) => {
  const [showFlare, setShowFlare] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const hasLiked = likes > 0

  const isOwner = user && thought && user.id === thought.userId

  useEffect(() => {
    if (isNewest) {
      setShowFlare(true)
      const timeout = setTimeout(() => setShowFlare(false), 1500)
      return () => clearTimeout(timeout)
    }
  }, [isNewest])

  const handleEdit = async (thoughtId, updatedData) => {
    const success = await onEdit(thoughtId, updatedData)
    if (success) {
      setShowEditModal(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this thought?")) {
      onDelete(thought._id)
    }
  }


  return (
    <>
      <StyledMessageItem>
        {isNewest && <FlareIcon $show={showFlare}>✨</FlareIcon>}
        <MessageHeader>
          <AuthorInfo>
            By: {thought && thought.username ? thought.username : "Anonymous"}
            {thought?.category && thought.category !== "other" && (
              <CategoryTag>{thought.category}</CategoryTag>
            )}
          </AuthorInfo>

          {isOwner && (
            <ActionButtons>
              <button className="edit" title="Edit Thought" onClick={() => setShowEditModal(true)}>✏️</button>
              <button className="delete" title="Delete Thought" onClick={handleDelete}>🗑️</button>
            </ActionButtons>
          )}
        </MessageHeader>

        <p>{text}</p>

        <StyledLikeContainer>
          <p> <StyledButton $hasLiked={hasLiked} onClick={onLike}>❤️  </StyledButton>
            x {likes}  </p>
          <p>{timeAgo(createdAt)}</p>
        </StyledLikeContainer>
      </StyledMessageItem>
      {showEditModal && (
        <EditModal
          thought={thought}
          onSave={handleEdit}
          onclose={() => setShowEditModal(false)}
        />
      )}
    </>
  )
}


export default MessageItem
