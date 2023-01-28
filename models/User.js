var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const Knex = require("knex");
const PasswordTokens = require("./PasswordTokens");
class User {
  async new(name, email, password) {
    try {
      var hash = await bcrypt.hash(password, 10);
      await knex
        .insert({ name, email, password: hash, role: 0 })
        .table("users");
    } catch (err) {
      console.log(err);
    }
  }

  async findEmail(email) {
    try {
      var result = await knex.select("*").from("users").where({ email: email });

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }

      console.log(result);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findAll() {
    try {
      var result = await knex
        .select(["id", "email", "name", "role"])
        .from("users");
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async findById(id) {
    try {
      var result = await knex
        .select(["id", "email", "name", "role"])
        .where({ id: id })
        .from("users");

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async findUserWithEmail(email) {
    try {
      var result = await knex
        .select(["id", "email", "name", "role", "password"])
        .where({ email: email })
        .from("users");

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async update(id, name, email, role) {
    var user = await this.findById(id);
    if (user != undefined) {
      var editUser = {};
      if (email != undefined) {
        if (user.email != email) {
          var result = await this.findEmail(email);
          if (result == false) {
            editUser.email = email;
          } else {
            return { status: false, err: "O email já está cadastrado!" };
          }
        }
      }
      if (name != undefined) {
        editUser.name = name;
      }
      if (role != undefined) {
        editUser.role = role;
      }
      try {
        await knex.update(editUser).where({ id: id }).table("users");
        return { status: true };
      } catch (err) {
        return { status: false };
      }
    } else {
      res.status(404);
      return { status: false, err: "Usuário não encontrado!" };
    }
  }

  async delete(id) {
    var user = await this.findById(id);
    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table("users");
        return { status: true };
      } catch (err) {
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: "O usuário não existe!" };
    }
  }

  async changePassword(newPassword, id, token) {
    var hash = await bcrypt.hash(newPassword, 10);
    try {
      await knex.update({ password: hash }).where({ id: id }).table("users");
      await PasswordTokens.setUsed(token);
      return { status: true };
    } catch (err) {
      console.log(err);
      return { status: false };
    }
  }
}

module.exports = new User();
