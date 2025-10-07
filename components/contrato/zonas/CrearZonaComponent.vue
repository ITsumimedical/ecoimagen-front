<template>
  <div>
    <v-container fluid class="pa-0">
      <v-card>
        <v-card-title class="titulo black--text">Crear Zona </v-card-title>
        <v-form ref="crearForm">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field label="Nombre *" v-model="crearForm.nombre" :error-messages="errors.zona">

                </v-text-field>
              </v-col>
            </v-row>

            <p>Campo obligatorio *</p>

            <v-card-actions class="justify-end">
              <v-btn color="error" @click="cerrarModal">cerrar
              </v-btn>
              <v-btn color="boton" dark @click="crearZona()">Guardar</v-btn>
            </v-card-actions>

          </v-card-text>
        </v-form>

         <!-- Preload -->
         <template>
          <div class="text-center">
            <v-dialog v-model="preload" persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  Tranquilo procesamos tu solicitud !
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </template>

      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    crearModal: {
      value: Boolean,
    }
  },

  data() {
    return {
      preload: false,
      errors:{
        zona: null
      },
      crearForm: {
        nombre: "",
      },

      rules: {
        obligatorio: (v) => !!v || "Este campo es obligatorio",
      }
    }
  },



  methods: {
    cerrarModal() {
      this.limpiarFormulario();
      this.$emit('cerrar')
    },

    async crearZona() {
      if (!this.$refs.crearForm.validate()) {
        return;
      }

      this.limpiarError();
      const request = {
        zona_id: this.crearForm.nombre,

      };

      try {
        this.preload = true;
        await this.$axios.post('/zonas/crear', this.crearForm, request);
        this.$toast.success('Se ha creado la Zona con exito !');
        this.cerrarModal();
        this.$emit("recargarZonas");
      } catch (error) {
        this.ErrorEntrada(error.response.data);
        this.$toast.error(error.response.data.mensaje);
      } finally {
        this.preload = false;
      }

    },

    limpiarFormulario() {
      this.crearForm = {
        nombre: "",
      }

      this.$refs.crearForm.resetValidation();
    },

    ErrorEntrada(errors) {
      for (const key in this.errors) {
        if (key in errors) {
          this.errors[key] = errors[key].join(",");
        }
      }
    },

    limpiarError() {
      for (const key in this.errors) {
        this.errors[key] = "";
      }
    },


  }


}
</script>
