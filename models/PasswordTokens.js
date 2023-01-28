var knex = require("../database/connection");
var User = require("./User");

class PasswordTokens {
  async create(email) {
    var user = await User.findUserWithEmail(email);
    if (user != undefined) {
      var token = Date.now();
      try {
        await knex
          .insert({
            token: token,
            user_id: user.id,
            used: 0,
          })
          .table("passwordtokens");
        return {
          status: true,
          token: token,
        };
      } catch (err) {
        return {
          status: false,
          err: err,
        };
      }
    } else {
      return {
        status: false,
        err: "O e-mail enviado não foi cadastrado ainda.",
      };
    }
  }

  async findToken(token) {
    try {
      var result = await knex
        .select("*")
        .where({ token: token })
        .from("passwordtokens");
      if (result.length > 0) {
        var tk = result[0];
        if (tk.used) {
          return { status: false, err: "Token inválido!" };
        } else {
          return { status: true, token: tk };
        }
      } else {
        return { status: false, err: "Token inválido!" };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async setUsed(token) {
    await knex
      .update({ used: 1 })
      .where({ token: token })
      .table("passwordtokens");
  }
}

module.exports = new PasswordTokens();
