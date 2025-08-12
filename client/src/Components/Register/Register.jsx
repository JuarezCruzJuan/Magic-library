import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../Assents/css/Register.css'

// Simulación de ReCAPTCHA ya que no podemos instalar la dependencia
const SimpleCaptcha = ({ onChange }) => {
  const [captchaValue, setCaptchaValue] = useState('')
  const captchaCode = useRef(Math.random().toString(36).substring(2, 8).toUpperCase())
  
  const handleChange = (e) => {
    setCaptchaValue(e.target.value)
    onChange(e.target.value === captchaCode.current)
  }
  
  const refreshCaptcha = () => {
    captchaCode.current = Math.random().toString(36).substring(2, 8).toUpperCase()
    setCaptchaValue('')
    onChange(false)
  }
  
  return (
    <div className="captcha-container">
      <div className="captcha-code">{captchaCode.current}</div>
      <input
        type="text"
        value={captchaValue}
        onChange={handleChange}
        placeholder="Ingrese el código CAPTCHA"
        className="captcha-input"
      />
      <button 
        type="button" 
        onClick={refreshCaptcha}
        className="refresh-captcha"
      >
        Refrescar
      </button>
    </div>
  )
}

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [passwordErrors, setPasswordErrors] = useState([])
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)


  const validatePassword = (password) => {
    const errors = []
    
    // 1. Longitud mínima de 8 caracteres
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres')
    }
    
    // 2. Utilizar mínimo una mayúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula')
    }
    
    // 3. Utilizar mínimo una minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula')
    }
    
    // 4. Utilizar mínimo un carácter especial
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial')
    }
    
    // 5. No permitir números consecutivos
    for (let i = 0; i < password.length - 1; i++) {
      if (
        !isNaN(parseInt(password[i])) && 
        !isNaN(parseInt(password[i+1])) && 
        parseInt(password[i]) + 1 === parseInt(password[i+1])
      ) {
        errors.push('La contraseña no debe contener números consecutivos')
        break
      }
    }
    
    // 6. No permitir letras consecutivas
    const lowerPassword = password.toLowerCase()
    for (let i = 0; i < lowerPassword.length - 1; i++) {
      if (
        lowerPassword[i] >= 'a' && lowerPassword[i] <= 'z' &&
        lowerPassword[i+1] >= 'a' && lowerPassword[i+1] <= 'z' &&
        lowerPassword[i].charCodeAt(0) + 1 === lowerPassword[i+1].charCodeAt(0)
      ) {
        errors.push('La contraseña no debe contener letras consecutivas del abecedario')
        break
      }
    }
    
    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
    
    if (name === 'password') {
      setPasswordErrors(validatePassword(value))
    }
  }

  const handlePrivacyChange = (e) => {
    setPrivacyAccepted(e.target.checked)
  }

  const openPrivacyPolicy = () => {
    window.open('/aviso-privacidad.pdf', '_blank')
  }
  
  const handleCaptchaChange = (verified) => {
    setCaptchaVerified(verified)
  }
  


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validar que se haya aceptado el aviso de privacidad
    if (!privacyAccepted) {
      setError('Debe aceptar el aviso de privacidad para continuar')
      return
    }
    
    // Validar CAPTCHA
    if (!captchaVerified) {
      setError('Por favor complete el CAPTCHA correctamente')
      return
    }

    // Validar contraseña
    const errors = validatePassword(formData.password)
    if (errors.length > 0) {
      setPasswordErrors(errors)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        ...formData,
        rol: 'cliente'
      })

      if (response.data.success) {
        alert('Registro exitoso. Por favor, revisa tu correo electrónico para activar tu cuenta.')
        navigate('/login')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error en el registro')
    }
  }

  return (
    <div className="register-container">
      <div className="register-box">
          <h2>Registro de Usuario</h2>
          {error && <div className="error-message">{error}</div>}
          {passwordErrors.length > 0 && (
            <div className="password-errors">
              <ul>
                {passwordErrors.map((err, index) => (
                  <li key={index} className="error-message">{err}</li>
                ))}
              </ul>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Sección del CAPTCHA */}
            <div className="captcha-section">
              <SimpleCaptcha onChange={handleCaptchaChange} />
            </div>
            
            {/* Sección del aviso de privacidad */}
            <div className="privacy-section">
              <div className="privacy-checkbox">
                <input
                  type="checkbox"
                  id="privacyAccepted"
                  checked={privacyAccepted}
                  onChange={handlePrivacyChange}
                  required
                />
                <label htmlFor="privacyAccepted">
                  He leído y acepto el aviso de privacidad
                </label>
              </div>
              <button 
                type="button" 
                className="privacy-link"
                onClick={openPrivacyPolicy}
              >
                Ver Aviso de Privacidad (PDF)
              </button>
            </div>

            <button type="submit">Registrarse</button>
            <button 
              type="button" 
              className="login-button"
              onClick={() => navigate('/login')}
            >
              Volver al Login
            </button>
          </form>
        </div>
    </div>
  )
}

export default Register