var User = require("../models/User");
var PasswordTokens = require("../models/PasswordTokens");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

var secret = "sduashiuahuiasasmlasmapopomd";

class UserController {
  async create(req, res) {
    var { name, email, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.send("Digite o email.");
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.send("O e-mail já está cadastrado! Tente outro.");
      return;
    }

    await User.new(name, email, password);

    res.status(200);
    res.send("Tudo ok!");
  }

  async index(req, res) {
    var result = await User.findAll();
    res.send(result);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var result = await User.findById(id);

    if (result == undefined) {
      res.status(404);
      res.send("Não existe usuário com esse ID.");
    } else {
      res.status(200);
      res.send(result);
    }
  }

  async editUser(req, res) {
    var { id, name, email, role } = req.body;
    var result = await User.update(id, name, email, role);
    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Usuário atualizado!");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Ocorreu algum erro no servidor...");
    }
  }

  async deleteUser(req, res) {
    var id = req.params.id;
    var result = await User.delete(id);
    if (result.status) {
      res.status(200);
      res.send("Usuário deletado com sucessso!");
    } else {
      res.status(424);
      res.send(result.err);
    }
  }

  async recoverPassword(req, res) {
    var email = req.body.email;
    var result = await PasswordTokens.create(email);
    if (result.status) {
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(404);
      res.send(result.err);
    }
  }

  async newPassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;
    var isTokenValid = await PasswordTokens.findToken(token);

    if (isTokenValid.status) {
      var result = await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      if (result.status) {
        res.status(200);
        res.send("Senha alterada!");
      } else {
        res.status(502);
        res.send(result.err);
      }
    } else {
      res.send(isTokenValid.err);
    }
  }

  async login(req, res) {
    var { email, password } = req.body;
    var user = await User.findUserWithEmail(email);

    if (user != undefined) {
      var result = await bcrypt.compare(password, user.password);

      if (result) {
        var token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200);
        res.json({ token: token });
      } else {
        res.send("Senha incorreta");
        res.status(406);
      }
    } else {
      res.json({ status: false });
    }
  }
}

module.exports = new UserController();
