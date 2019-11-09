@Decorators.vueComponent("login")
class LoginComponent {
  isLogin: boolean = true;
  formError: string = '';

  username: string = '';
  email: string = '';
  password: string = '';

  mounted() {
    this.isLogin = true;
  }

  onUpdateForm(e) {
    this.formError = '';
    e.target.setCustomValidity('');
    console.log(e.target)
  }

  onSubmitSignup(e) {
    e.preventDefault();

    Accounts.createUser({
      username: this.username,
      email: this.email,
      password: this.password,
    }, (err) => {
      if (err && err.reason === "Username already exists.") {
        this.formError = "Le nom d'utilisateur existe déjà.";
        e.target.username.setCustomValidity("Le nom d'utilisateur existe déjà.");
      }
      else if (err && err.reason === "Email already exists.") {
        this.formError = "L'email est déjà utilisé.";
        e.target.email.setCustomValidity("L'email est déjà utilisé.");
      }
      else if (err) {
        console.log(err);
        this.formError = "Une erreur est survenue.";
      }
    });
  }

  onSubmitLogin(e) {
    e.preventDefault();

    Meteor.loginWithPassword(
      this.email,
      this.password,
      (err) => {
        if (err) {
          this.formError = "L'identifiant ou le mot de passe est erroné.";
          e.target.username.setCustomValidity("L'identifiant ou le mot de passe est erroné.");
          e.target.email.setCustomValidity("L'identifiant ou le mot de passe est erroné.");
        }
        else if (err) {
          this.formError = "Une erreur est survenue.";
        }
      },
    );
  }
}
this.LoginComponent = LoginComponent;
