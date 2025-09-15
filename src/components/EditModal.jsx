import { useState } from "react"
import styled from "styled-components"

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: #dfdada;
  border: 1px solid #0e0d0d;
  box-shadow: 4px 4px black;
  padding: 20px;
  max-width: 320px;
  width: 90%;
  box-sizing: border-box;
`
const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  textarea {
    width: 100%;
    min-height: 80px;
    padding: 10px;
    border: 1px solid #ccc;
    font-size: 1rem;
    box-sizing: border-box;
    resize: none;
  }
  select {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
  }
  `
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  
  button {
    padding: 10px 15px;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-weight: bold;
    
    &.save {
      background-color: #f78a8a;
      &:hover { background-color: #f56565; }
    }
    
    &.cancel {
      background-color: #ccc;
      &:hover { background-color: #aaa; }
    }
    
    &:disabled {
      background-color: #ddd;
      cursor: not-allowed;
    }
  }
`


const CharacterCount = styled.p`
  font-size: 0.8rem;
  color: ${props => props.$isOver ? 'red' : '#555'};
  margin: 0;
`

const EditModal = ({ thought, onSave, onclose }) => {
  const [message, setMessage] = useState(thought.message)
  const [category, setCategory] = useState(thought.category)
  const [isLoading, setIsLoading] = useState(false)

  const characterLeft = 140 - message.length
  const isValid = message.length > 0 && message.length <= 140

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isValid) return
    setIsLoading(true)
    await onSave(thought._id, { message, category })
    setIsLoading(false)
  }

  const categories = [
    "happy", "family", "friends", "pets",
    "nature", "funny", "gratitude", "other"
  ]

  return (
    <ModalOverlay onClick={onclose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>Edit Thought</h3>
        <ModalForm onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What is making you happy today? "
            disabled={isLoading}
          />
          <CharacterCount $isOver={characterLeft < 0}>
            Character left: {characterLeft}
          </CharacterCount>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <ButtonGroup>
            <button
              type="button"
              className="cancel"
              onClick={onclose}
              disabled={isLoading}
            >Cancel</button>
            <button
              type="submit"
              className="save"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </ButtonGroup>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  )
}

export default EditModal






