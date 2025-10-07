<template>
    <v-dialog v-model="mostrarCrearBoletin" persistent max-width="1000px">
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="info"
          icon="mdi-file-document-alert-outline"
        >
          <b>Crear Nueva imagen soporte</b>
        </v-alert>
        <v-card-text>
          <v-form ref="formNuevoBoletin">
            <v-row dense>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="nuevoBoletin.nombre"
                  label="Nombre *"
                  :rules="rules.nombre"
                  dense
                ></v-text-field>
              </v-col>

               <v-col cols="3" sm="6" md="6">
                            <v-file-input v-model="nuevoBoletin.adjunto" label="Imagen *" :rules="rules.adjunto" dense
                                accept=".jpeg, .jpg"></v-file-input>
                </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="cerrarModal"> Cerrar </v-btn>
          <v-btn color="success" small @click="crearBoletin"> Crear </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

  <script>
  export default {
    props: {
      mostrarCrearBoletin: Boolean,
    },
    data() {
      return {
        nuevoBoletin: {
          nombre: "",
          adjunto: null,
        },
        rules: {
                    nombre: [(v) => !!v || "El campo nombre es requerido"],
                    adjunto: [(v) => !!v || "El campo imagen es requerido"],
                },
      };
    },
    methods: {
      cerrarModal() {
        this.limpiarFormulario();
        this.$emit("update:mostrarCrearBoletin", false);
      },

      crearBoletin() {
        if (!this.$refs.formNuevoBoletin.validate()) {
          this.$toast.error("Debe corregir los errores antes de continuar");
          return;
        }

        this.$emit("crearBoletin", this.nuevoBoletin);
        this.cerrarModal();
      },

      limpiarFormulario() {
        for (const key in this.nuevoBoletin) {
          this.nuevoBoletin[key] = "";
        }

        this.$refs.formNuevoBoletin.resetValidation();
      },
    },
  };
  </script>
