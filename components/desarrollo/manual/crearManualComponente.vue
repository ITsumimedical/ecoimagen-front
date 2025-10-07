<template>
  <div>
  <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Crear
              </v-btn>
            </template>
            <v-card>
              <v-card-title style="background: #74bc1f">
                <span style="color:white" class="text-h5">Nuevo manual</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="manual.nombre" label="Nombre" :error-messages="errors.nombre">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-file-input label="File input" outlined dense></v-file-input>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close">
                  Cancelar
                </v-btn>
                <!-- <v-btn color="primary" @click="guardarRoles">
                  Guardar
                </v-btn> -->
              </v-card-actions>
            </v-card>
          </v-dialog>
  </div>
</template>

<script>
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
  data() {
      return {
        dialog: false,
        manual: {
          nombre: ''
        },
        errors: {
          nombre: ''
        },
      };
    },

    methods: {
      close() {
        this.dialog = false
        // this.rol.name = ''
        // this.limpiarError()
      },

      //  async guardarRoles() {
      //     try {
      //       const {
      //         data
      //       } = await this.$loadingPostRequest(guardarRoles(), this.rol)
      //       this.$toast.success(data.mensaje)
      //       this.limpiarError()
      //       this.listarRoles()
      //       this.close()
      //     } catch (error) {
      //       if (error.response.data.mensaje) {
      //         this.$toast.error(error.response.data.mensaje)
      //       } else if (error.response.data) {
      //         this.ErrorEntrada(error.response.data)
      //       }
      //     }
      //   },

    }

}
</script>

<style>

</style>
