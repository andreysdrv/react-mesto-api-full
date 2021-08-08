const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

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
    avatar: Joi.string().required().custom(customValidate),
  }),
});

module.exports = {
  userValidation,
  cardValidation,
  userAboutValidation,
  avatarValidation,
  loginValidation,
  idValidation,
};
