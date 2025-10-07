<template>
  <v-dialog v-model="mostrarModalCrear" max-width="900px" persistent>
    <v-card>
      <v-alert
        dense
        text
        border="left"
        icon="mdi-scale-balance"
        color="primary"
      >
        <b>Crear Derecho</b>
      </v-alert>
      <v-card-text>
        <v-form ref="formCrearDerecho">
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                dense
                outlined
                v-model="formCrear.descripcion"
                label="Descripción *"
                :rules="[rules.obligatorio, rules.min, rules.max]"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" small @click="cerrarModal()">Cancelar</v-btn>
        <v-btn color="success" small @click="crearDerecho()">Guardar</v-btn>
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
      formCrear: {
        descripcion: "",
      },
      rules: {
        obligatorio: (value) => !!value || "Este campo es obligatorio.",
        min: (v) =>
          (v && v.length >= 10) || "Este campo debe tener mínimo 10 caracteres.",
        max: (v) =>
          (v && v.length <= 350) ||
          "Este campo debe tener maximo 350 caracteres.",
      },
    };
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    crearDerecho() {
      if (!this.$refs.formCrearDerecho.validate()) {
        return;
      }

      this.setPreload(true);
      this.$axios
        .post("/derechos/crearDerecho", this.formCrear)
        .then((res) => {
          this.$toast.success(res.data.mensaje);
          this.$emit("listarDerechos");
          this.cerrarModal();
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    limpiarFormulario() {
      this.formCrear = {
        descripcion: "",
      };
    },

    cerrarModal() {
      this.limpiarFormulario();
      this.$refs.formCrearDerecho.resetValidation();
      this.$emit("update:mostrarModalCrear", false);
    },
  },
};
</script>
