const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// // eslint-disable-next-line no-useless-escape
// const linkRegExp = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+#*/;

const customValidate = (url) => {
  const result = validator.isURL(url);
  if (!result) {
    throw new Error('URL is not valid');
  }
  return url;
};

const idValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().custom(customValidate),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(customValidate),
  }),
});

const userAboutValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(customValidate).required(),
  }),
});

module.exports = {
  // linkRegExp,
  userValidation,
  cardValidation,
  userAboutValidation,
  avatarValidation,
  loginValidation,
  idValidation,
};
