<template>
  <v-dialog v-model="mostrarModalEditar" max-width="900px" persistent>
    <v-card>
      <v-alert
        dense
        text
        border="left"
        icon="mdi-scale-balance"
        color="primary"
      >
        <b>Editar Derecho</b>
      </v-alert>
      <v-card-text>
        <v-form ref="formEditarDerecho">
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                dense
                outlined
                v-model="derechoActual.descripcion"
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
        <v-btn color="success" small @click="editarDerecho()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarModalEditar: {
      type: Boolean,
      default: false,
    },

    derecho: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      derechoActual: {},
      rules: {
        obligatorio: (value) => !!value || "Este campo es obligatorio.",
        min: (v) =>
          (v && v.length >= 10) ||
          "Este campo debe tener mínimo 10 caracteres.",
        max: (v) =>
          (v && v.length <= 350) ||
          "Este campo debe tener maximo 350 caracteres.",
      },
    };
  },
  watch: {
    mostrarModalEditar(newValue) {
      if (newValue) {
        this.buscarDerecho();
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    buscarDerecho() {
      this.setPreload(true);
      this.$axios
        .get(`/derechos/listarDerechoPorId/${this.derecho.id}`)
        .then((res) => {
          this.derechoActual = res.data;
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    editarDerecho() {
      if (!this.$refs.formEditarDerecho.validate()) {
        return;
      }

      const data = {
        descripcion: this.derechoActual.descripcion,
      };

      this.setPreload(true);
      this.$axios
        .post(`/derechos/editarDerecho/${this.derecho.id}`, data)
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

    cerrarModal() {
      this.$refs.formEditarDerecho.resetValidation();
      this.$emit("update:mostrarModalEditar", false);
    },
  },
};
</script>
