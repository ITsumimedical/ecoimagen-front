<template>
  <v-dialog v-model="mostrarModalCrear" persistent max-width="800px">
    <v-card>
      <v-alert dense text color="primary" icon="mdi-plus-circle-outline">
        <b>Crear Tipo de Ruta </b>
      </v-alert>
      <v-card-text>
        <v-form ref="formNuevaRuta">
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                dense
                outlined
                v-model="formRuta.nombre"
                label="Nombre *"
                :rules="[rules.obligatorio]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                dense
                outlined
                auto-grow
                v-model="formRuta.descripcion"
                label="Descripción *"
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
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    mostrarModalCrear: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formRuta: {
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
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.limpiarFormulario();
      this.$emit("update:mostrarModalCrear", false);
    },

    async enviarFormulario() {
      if (!this.$refs.formNuevaRuta.validate()) {
        return;
      }

      try {
        this.setPreload(true);
        await this.$axios.post("/tipo-rutas/crear-tipo-ruta", this.formRuta);
        this.$toast.success("Se ha creado el tipo de ruta");
        this.cerrarModal();
        this.$emit("recargarRutas");
      } catch (error) {
        this.$toast.error("Ha ocurrido un error al crear la ruta");
      } finally {
        this.setPreload(false);
      }
    },

    limpiarFormulario() {
      this.formRuta = {
        nombre: "",
        descripcion: "",
      };
      this.$refs.formNuevaRuta.resetValidation();
    },
  },
};
</script>
