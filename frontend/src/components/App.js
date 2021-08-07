/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import PopupWithForm from './PopupWithForm'
import ImagePopup from './ImagePopup'
import { api } from '../utils/api'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ProtectedRoute from './ProtectedRoute';
import Login from './Login'
import Register from './Rigister'
import * as auth from '../utils/auth'
import InfoTooltip from './InfoTooltip'
import success from '../images/success.svg'
import unSuccess from '../images/unsuccess.svg'


function App() {
  const history = useHistory()

  const [loggedIn, setLoggedIn] = useState(false)
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)
  const [message, setMessage] = useState({ imgPath: '', text: '' })
  
  const [email, setEmail] = useState('')

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [cards, setCards] = useState([])
  const [currentUser, setCurrentUser] = useState({})

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true)
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false)
    setEditProfilePopupOpen(false)
    setAddPlacePopupOpen(false)
    setSelectedCard(null)
    setIsInfoTooltipOpen(false)
  }

  function onCardClick(card) {
    setSelectedCard(card)
  }

  function onUpdateUser(userData) {
    api.setUserInfoApi(userData)
      .then((user) => {
        setCurrentUser(user.data)
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  function onUpdateAvatar(userData) {
    api.handleUserAvatar(userData)
      .then((user) => {
        setCurrentUser(user.data)
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(id => id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard.data : c))
      })
      .catch((err) => console.log(err))
  }

  function handleCardDelete(card) {
    api.delete(card._id)
      .then(() => {
        setCards(cards => cards.filter((item) => item !== card))
      })
      .catch((err) => console.log(err))
  }

  function handleAddPlaceSubmit(cardData) {
    api.addUserCard(cardData)
      .then((newCard) => {
        setCards([newCard.data, ...cards])
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    if (loggedIn) {
      api.getInitialCards()
        .then((cardsObj) => {
          setCards(cardsObj.data.reverse())
        })
        .catch((err) => console.log(err))
    }
  }, [loggedIn])

  useEffect(() => {
    if (loggedIn) {
      api.getUserInfo()
        .then((user) => {
          setCurrentUser(user.currentUser)
        })
        .catch((err) => console.log(err))
    }
  }, [loggedIn])

  useEffect(() => {
    tokenCheck()
  }, [])

  function tokenCheck() {
    auth.getContent()
      .then((res) => {
        if(res) {
          setLoggedIn(true)
          setEmail(res.currentUser.email)
          history.push('/')
        }
      })
      .catch((err) => console.log(err))
  }

  function handleRegistration(password, email) {
    auth.register(password, email)
      .then((result) => {
        setEmail(result.data.email)
        setMessage({ imgPath: success, text: 'Вы успешно зарегистрировались!' })
      })
      .catch(() => setMessage({ imgPath: unSuccess, text: 'Что-то пошло не так! Попробуйте ещё раз.' }))
      .finally(() => setIsInfoTooltipOpen(true))
  }

  function handleAuth(password, email) {
    auth.authorize(password, email)
      .then((token) => {
        auth.getContent(token)
          .then((res) => {
            setEmail(res.currentUser.email)
            setLoggedIn(true)
            history.push('/')
          })
      })
      .catch((err) => console.log(err))
  }

  function onSignOut() {
    auth.logout()
    setLoggedIn(false)
    setCards([])
    setCurrentUser({})
    history.push('/sign-in')
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          email={email}
          onSignOut={onSignOut}
        />
        <Switch>
          <ProtectedRoute
            exact path='/'
            loggedIn={loggedIn}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={onCardClick}
            handleCardLike={handleCardLike}
            handleCardDelete={handleCardDelete}
            cards={cards}
          />
          <Route path='/sign-up'>
            <Register
              isOpen={isEditProfilePopupOpen}
              onRegister={handleRegistration}
              isInfoTooltipOpen={isInfoTooltipOpen}
            />
          </Route>
          <Route path='/sign-in'>
            <Login
              isOpen={isEditProfilePopupOpen}
              onAuth={handleAuth}
            />
          </Route>
        </Switch>
        <Footer />
        <InfoTooltip
          name='tooltip'
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          title={message.text}
          imgPath={message.imgPath}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={onUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}        
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={onUpdateAvatar}
        />
        <PopupWithForm
          name='confirm-delete'
          title='Вы уверены?'
          buttonText='Да'
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
