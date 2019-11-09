@Decorators.vueComponent("login")
class LoginComponent {
  $router: VueRouter;

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
      else {
        this.$router.push('/');
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
          e.target.email.setCustomValidity("L'identifiant ou le mot de passe est erroné.");
          e.target.password.setCustomValidity("L'identifiant ou le mot de passe est erroné.");
        }
        else if (err) {
          this.formError = "Une erreur est survenue.";
        }
        else {
          this.$router.push('/');
        }
      },
    );
  }
}
this.LoginComponent = LoginComponent;
