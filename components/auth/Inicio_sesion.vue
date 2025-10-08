<template>
  <v-app>
    <div id="background-login">
      <v-container fluid style="margin-top: -115px">
        <v-card elevation="0" id="login">
          <v-form>
            <v-row>
              <v-col cols="12" lg="3" class="mx-auto">
                <div style="text-align: center">
                  <img src="../../static/images/logoEcoimagen.png" alt="Fomag Logo" width="390px" height="290px" />
                </div>

                <h2 style="color: #125dad; text-align: center">Bienvenido</h2>


                <v-col cols="12">
                  <v-text-field solo v-model="user.email" autofocus :append-icon="'mdi-gmail'"
                    label="Correo Electrónico"></v-text-field>
                  <v-text-field solo @keyup.enter="submit()" :append-icon="ver ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="ver ? 'text' : 'password'" class="form-field animation a4" @click:append="ver = !ver"
                    v-model="user.password" label="Contraseña" hide-details></v-text-field>
                </v-col>


                <v-card-actions>
                  <v-btn small block v-if="reset != false" @click="consultarCorreo()"><b>Enviar</b>
                  </v-btn>
                  <v-btn small block v-if="reset != false" @click="reset = false"><b>Cancelar</b>
                  </v-btn>
                  <v-row>
                    <v-col cols="12">
                      <v-btn block v-if="reset != true" @click="submit()" :disabled="loading" :loading="loading"
                        class="mb-2" color="success">Ingresar
                      </v-btn>
                    </v-col>
                    <!-- <v-col cols="12">
                      <v-btn block v-if="reset != true" @click="resetPassword()" color="warning">Recuperar
                        contraseña
                      </v-btn>
                    </v-col> -->
                  </v-row>
                </v-card-actions>


                <v-dialog v-model="dialog" max-width="400">
                  <v-card>
                    <v-card-title class="text-h6" style="background-color:#CFD8DC">
                      <v-icon right color="#263238" style="margin-right:1%">mdi-account-cog</v-icon>
                      Seleccione un
                      tipo de
                      usuario
                    </v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn style="background: #63bf6d;margin-right:1%" small dark @click="redirectAfiliado">Afiliado
                      </v-btn>
                      <v-btn style="background: #1565C0" small dark @click="redirectUsuario">Funcionario</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-col cols="12">
                </v-col>
              </v-col>
            </v-row>
          </v-form>

          <v-dialog v-model="dialog" max-width="400">
            <v-card>
              <v-card-title class="text-h6" style="background-color: #cfd8dc">
                <v-icon right color="#263238" style="margin-right: 1%">mdi-account-cog</v-icon>
                Seleccione un tipo de usuario
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn style="background: #63bf6d; margin-right: 1%" small dark @click="redirectAfiliado">Afiliado
                </v-btn>
                <v-btn style="background: #1565c0" small dark @click="redirectUsuario">Funcionario</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-container>

      <v-dialog v-model="modalCambioContrasenaFuncionario" max-width="1100" persistent>
        <v-card>
          <recuperacion-contrasena-operador @cerrarModal="modalCambioContrasenaFuncionario = false, dialog = false"  />
        </v-card>
      </v-dialog>

    </div>


    <div class="boton-flotante">
      <boton-whatsapp :max-height="200" :max-width="200" />
    </div>
  </v-app>
</template>

<script>

import {
  mapActions
} from "vuex";
import botonWhatsapp from "@/components/globales/botonWhatsapp.vue";
import RecuperacionContrasenaOperador from "./recuperacionContrasenaOperador/recuperacionContrasenaOperador.vue";
import { contrasenaExpirada } from '~/services/auth';

export default {
  name: "Login",
  components: {
    botonWhatsapp,
    RecuperacionContrasenaOperador
  },
  data() {
    return {
      dialog: false,
      ver: false,
      loading: false,
      rules: {
        emailMatch: () => "The email and password you entered don't match",
      },
      user: {
        email: "",
        password: "",
        password_confirmation: "",
      },
      errors: {
        email: "",
        password: "",
      },
      reset: false,
      modalCambioContrasenaFuncionario: false
    }
  },
  methods: {
    ...mapActions("auth", ["login"]),

    async submit() {
      this.reset = false;

      try {
        // const token = await this.$recaptcha.getResponse();

        this.loading = true;
        const request = {
          email: this.user.email,
          password: this.user.password,
          // recaptcha_token: token
        };
        await this.login(request);

        const user = this.$store.state.auth.usuario;

        if (contrasenaExpirada(user)) {
          this.$store.dispatch("cambioContrasena/abrirModalCambioContrasena");
        }

        this.$router.push("/inicio/bannerInicial");
        this.$toast.success("Hola! Bienvenido");
        // this.$recaptcha.reset();
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.$toast.error(error.response.data.message);
        } else if (error.response && error.response.data) {
          this.setErrorInputs(error.response.data);
          return this.$swal.fire({
            title: "Señor Afiliado",
            icon: "info",
            type: "info",
            html: `Recuerde que puede conocer el usuario de ingreso y actualizar la contraseña en el siguiente link, <a href="https://horus-health.com/actualizacionpacientes">https://horus2.horus-health.com/actualizacionpacientes</a>`,
          });
        }
      } finally {
        this.loading = false;
      }
    }
    ,

    resetPassword() {
      this.dialog = true;
    },
    
    redirectAfiliado() {
      this.$router.push({
        name: "actualizacionPacientes",
      });
      this.dialog = false;
    },


    redirectUsuario() {
      this.modalCambioContrasenaFuncionario = true;
      this.dialog = false;
    },

    setErrorInputs(errors) {
      for (const key in this.errors) {
        if (key in errors) {
          this.errors[key] = errors[key].join(",");
        }
      }
      this.$toast.error(errors.email);
      this.$toast.error(errors.password);
    },

    clearErrorInputs() {
      for (const key in this.errors) {
        this.errors[key] = "";
      }
    },

    onError(error) {
      console.log('Error happened:', error)
    },

    onSuccess(token) {
      console.log('Succeeded:', token)
    },

    onExpired() {
      console.log('Expired')
    }
  },
};

</script>
<style scoped>
#background-login {
  background-image: url("../../static/images/fondo-horus.png");
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
}

#login {
  background-color: #ffffff00;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1);
}

.boton-flotante {
  position: fixed;
  bottom: 40px;
  right: 40px;
  left: 200px;
  z-index: 9999;
}
</style>
