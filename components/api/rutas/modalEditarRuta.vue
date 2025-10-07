<template>
  <div>
    <v-dialog v-model="mostrarModalEditar" persistent max-whidth="800px">
      <v-card>
        <v-alert dense text color="primary" icon="mdi-plus-circle-outline">
          <b>Editar Tipo de Ruta - {{ rutaSeleccionada?.id }} </b>
        </v-alert>
        <v-card-text>
          <v-form ref="formEditarRuta">
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  label="Nombre *"
                  v-model="ruta.nombre"
                  dense
                  outlined
                  :rules="[rules.obligatorio]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  label="Descripcion *"
                  v-model="ruta.descripcion"
                  dense
                  outlined
                  :rules="[rules.obligatorio, rules.minimo]"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
          <v-btn small dark color="success" @click="enviarFormulario()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    mostrarModalEditar: {
      type: Boolean,
      default: false,
    },

    rutaSeleccionada: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ruta: {
        nombre: "",
        descripcion: "",
      },
      rules: {
        obligatorio: (v) => !!v || "Este campo es obligatorio ",
        minimo: (v) =>
          v.length >= 10 || "Este campo debe tener al menos 10 caracteres ",
      },
    };
  },
  watch: {
    mostrarModalEditar(newValue) {
      if (newValue) {
        this.listaRutaPorId();
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.$emit("update:mostrarModalEditar", false);
    },

    async listaRutaPorId() {
      try {
        this.setPreload(true);
        const response = await this.$axios.get(
          `/tipo-rutas/listar-ruta-por-id/${this.rutaSeleccionada.id}`
        );
        this.ruta = response.data;
      } catch (error) {
        console.log(error);

        this.$toast.error("Ha ocurrido un error al listar ruta");
      } finally {
        this.setPreload(false);
      }
    },

    async enviarFormulario() {
      if (!this.$refs.formEditarRuta.validate()) {
        return;
      }
      try {
        this.setPreload(true);
        await this.$axios.post(
          `/tipo-rutas/actualizar-ruta/${this.rutaSeleccionada.id}`,
          this.ruta
        );
        this.$toast.success("Se ha actualizado la Ruta Correctamente");
        this.cerrarModal();
        this.$emit("recargarRutas");
      } catch (error) {
        console.log(error);
        
        this.$toast.error("ha ocurrido un error al Actualizar esta Ruta");
      } finally {
        this.setPreload(false);
      }
    },
  },
};
</script>
