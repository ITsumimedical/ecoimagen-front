<template>
    <v-dialog
      v-model="mostrarEditarBoletin"
      persistent
      max-width="1000px"
      v-if="boletin"
    >
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="info"
          icon="mdi-file-document-alert-outline"
        >
          <b>Editar Boletin {{ boletin?.nombre }}</b>
        </v-alert>
        <v-card-text>
          <v-form ref="formularioEditarBoletin">
            <v-row dense v-if="boletin">
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="formEditarBoletin.nombre"
                  label="Nombre *"
                  :rules="[
                    () => !!formEditarBoletin.nombre || 'Este campo es requerido',
                  ]"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  v-model="formEditarBoletin.descripcion"
                  label="Descripción *"
                  :rules="[
                    () =>
                      !!formEditarBoletin.descripcion || 'Este campo es requerido',
                    () =>
                      formEditarBoletin.descripcion.length >= 5 ||
                      'Este campo debe tener al menos 5 caracteres',
                    () =>
                      formEditarBoletin.descripcion.length <= 250 ||
                      'Este campo debe tener como máximo 250 caracteres',
                  ]"
                  dense
                  auto-grow
                  append-icon="mdi-content-paste"
                  @click:append="pegarDesdeClipboard('descripcion')"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="formEditarBoletin.url"
                  label="Enlace *"
                  :rules="[
                    () => !!formEditarBoletin.url || 'Este campo es requerido',
                  ]"
                  dense
                  append-icon="mdi-content-paste"
                  @click:append="pegarDesdeClipboard('url')"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="cerrarModal"> Cerrar </v-btn>
          <v-btn color="success" small @click="editarBoletin"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  <script>
  import { mapActions } from "vuex";
  
  export default {
    props: {
      mostrarEditarBoletin: Boolean,
      boletin: { type: Object, required: true },
    },
    data() {
      return {
        formEditarBoletin: {
          nombre: "",
          url: "",
          descripcion: "",
        },
      };
    },
    watch: {
      boletin: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.reiniciarFormulario();
          }
        },
      },
      mostrarEditarBoletin(val) {
        if (val && this.boletin) {
          this.reiniciarFormulario();
        }
      },
    },
    methods: {
      ...mapActions("app", ["setPreload"]),
  
      reiniciarFormulario() {
        this.formEditarBoletin.nombre = this.boletin.nombre;
        this.formEditarBoletin.url = this.boletin.url;
        this.formEditarBoletin.descripcion = this.boletin.descripcion;
      },
  
      cerrarModal() {
        this.$emit("update:mostrarEditarBoletin", false);
      },
  
      async pegarDesdeClipboard(campo) {
        try {
          const text = await navigator.clipboard.readText();
          this.formEditarBoletin[campo] = text;
        } catch (err) {
          console.error("Error al pegar desde el portapapeles: ", err);
        }
      },
  
      editarBoletin() {
        if (!this.$refs.formularioEditarBoletin.validate()) {
          this.$toast.error("Debe corregir los errores antes de continuar");
          return;
        }
  
        const data = {
          id: this.boletin.id,
          ...this.formEditarBoletin,
        };
  
        this.$emit("editarBoletin", data);
        this.cerrarModal();
      },
    },
  };
  </script>