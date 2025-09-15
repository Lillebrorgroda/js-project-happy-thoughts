// components/AuthForm.js
import React, { useState } from 'react'
import styled from 'styled-components'

const StyledAuthContainer = styled.div`
  background-color: #dfdada;
  border: 1px solid #0e0d0d;
  box-shadow: 4px 4px black;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 320px;
  padding: 20px;
  margin: 20px auto;
  box-sizing: border-box;
`

const StyledAuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
  }
  
  button {
    padding: 12px;
    background-color: #f78a8a;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    
    &:hover {
      background-color: #f56565;
    }
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`

const StyledToggle = styled.p`
  text-align: center;
  margin-top: 10px;
  
  button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.9rem;
  }
`

const StyledError = styled.p`
  color: red;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
`


const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password:
      ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = "https://lillebrorgrodas-first-api.onrender.com"



  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
    setError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const endpoint = isLogin ? "/users/login" : "/users/register"
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : formData

    try {
      const response = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("userId", data.userId || data._id)
        onAuthSuccess(data)
      } else {
        setError(data.message || "Authentication failed")
      }
    } catch (error) {
      console.error("Error during authentication:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <StyledAuthContainer>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <StyledAuthForm onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
            minLength={3}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength={6}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
        {error && <StyledError>{error}</StyledError>}
      </StyledAuthForm>
      <StyledToggle>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register here" : "Login here"}
        </button>
      </StyledToggle>
    </StyledAuthContainer>
  )
}

export default AuthForm;
