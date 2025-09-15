import styled from "styled-components"

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100%;
  padding: 0 10px;
  box-sizing: border-box;

  label {
    font-size: 1rem;
    font-weight: bold;
  }

  textarea {
    width: 100%;
    min-height: 80px;
    padding: 10px;
    font-size: 1rem;
    box-sizing: border-box;
    resize: none;      
  }

  select {
        width: 100%;
    padding: 10px;
    font-size: 1rem;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
  }

  button {
    align-self: flex-start;
    padding: 10px 15px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 20px;
    background-color: #f78a8a;
    border: none;

    &:hover { background-color: #f56565; }
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
  `

const CharacterCount = styled.p`
    font-size: 0.8rem;
    color: ${(props) => (props.$isOver ? "red" : "#555")};
  `


const CategoryLabel = styled.label`
  font-size: 0.9rem !important;
  font-weight: normal !important;
  color: #666;
  margin-top: 5px;
`


const MessageForm = ({ messageText, setMessageText, category, setCategory, onSubmit }) => {
  const characterLeft = 140 - messageText.length
  const isValid = messageText.length > 0 && messageText.length <= 140

  const categories = [
    { value: "other", label: "Other" },
    { value: "happy", label: "Happy" },
    { value: "family", label: "Family" },
    { value: "friends", label: "Friends" },
    { value: "pets", label: "Pets" },
    { value: "nature", label: "Nature" },
    { value: "funny", label: "Funny" },
    { value: "gratitude", label: "Gratitude" }
  ]


  return (
    <StyledForm onSubmit={onSubmit}>
      <label htmlFor="message">What is making you happy right now?</label>
      <textarea
        id="message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <CategoryLabel htmlFor="category">Category (optional):</CategoryLabel>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map(cat => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      <button type="submit" disabled={!isValid}>❤️ Send Happy Thought ❤️</button>
      <CharacterCount $isOver={characterLeft < 0}>
        Characters left: {characterLeft}
      </CharacterCount>
    </StyledForm>
  )
}

export default MessageForm