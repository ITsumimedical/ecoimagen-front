<template>
  <div>
    <v-dialog v-model="dialogoEditar" max-width="500px">
            <v-card>
              <v-card-title style="background: #74bc1f">
                <span style="color:white" class="text-h5">Editar manual</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editarManual.nombre"  label="Nombre*">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*Indica campo requerido</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="dialogoEditar=false">
                  Cancelar
                </v-btn>
                <!-- <v-btn color="primary" @click="actualizarRol(editarManual.id)">
                  Editar
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
        dialogoEditar: false,
        editarManual: {
          nombre: '',
        },
      };
    },

    methods: {
      // async actualizarRol(id) {
      //     try {
      //       const {
      //         data
      //       } = await this.$loadingPutRequest(actualizarRol(id), this.editarRol)
      //       this.$toast.success(data.mensaje)
      //       this.dialogoEditar = false
      //       this.listarRoles()
      //     } catch (error) {

      //     }
      //   },


    },

}
</script>

