<template>
  <div>
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
            <span>Restablecer contraseña</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-card-title>
    <!-- actualización de contraseña -->
    <v-container fluid class="d-flex justify-center align-center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0">
          <v-card-text>
            <v-alert text dense border="left" type="info" icon="mdi-shield-key-outline">
              Proceso de restablecimiento de contraseña
            </v-alert>
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="formCambiarcontrasena.nuevaContrasena" solo
                  :append-icon="mostrarContrasena ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="mostrarContrasena = !mostrarContrasena" dense
                  :type="mostrarContrasena ? 'text' : 'password'" label="Nueva contraseña">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="formCambiarcontrasena.confirmarNuevaContrasena" solo
                  :append-icon="mostrarConfirmarContrasena ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="mostrarConfirmarContrasena = !mostrarConfirmarContrasena" dense
                  :type="mostrarConfirmarContrasena ? 'text' : 'password'" label="Confirmar contraseña">
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" small dark @click="actualizacionContrasena()">
              Actualizar contraseña
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonCambioContrasena',
    layout: 'actualizacion',
    auth: false,

    data() {
      return {
        formCambiarcontrasena: {
          nuevaContrasena: null,
          confirmarNuevaContrasena: null,
          user_id: null,
          token: null,
        },
        mostrarContrasena: false,
        mostrarConfirmarContrasena: false,
      };
    },

    mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      this.formCambiarcontrasena.user_id = urlParams.get('user_id');

      if (token) {
        this.formCambiarcontrasena.token = token;
      }
    },


    methods: {
      actualizacionContrasena() {
        if (this.formCambiarcontrasena.nuevaContrasena !== this.formCambiarcontrasena.confirmarNuevaContrasena) {
          this.$toast.error('Las contraseñas no coinciden');
        } else {
          this.$axios.post("/auth/recuperar-contrasena", this.formCambiarcontrasena).then((res) => {
            this.$toast.success('Contraseña actualizada')
            setTimeout(() => {
              window.location.href = "https://horus-health.com/";
            }, 2000);
          }).catch((e) => {
            this.$toast.error(e.response.data.error);
          });
        }
      }
    }
  };

</script>
