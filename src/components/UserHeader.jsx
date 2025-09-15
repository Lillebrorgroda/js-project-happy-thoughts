import styled from "styled-components"

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;

  button {
    padding: 8px 16px;
    background-color: #f78a8a;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      background-color: #f56565;
    }
  }
`
const UserHeader = ({ user, onLogout }) => {
  return (
    <StyledHeader>
      <span>Welcome, {user?.username || "User"}!</span>
      <button onClick={onLogout}>Logout</button>
    </StyledHeader>
  )
}

export default UserHeader