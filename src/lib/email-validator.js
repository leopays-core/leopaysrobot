const emailValidator = {
  validator: function (text) {
    return text.includes('@');
  },
  message: "Email must have '@'.",
};

module.exports = emailValidator;
