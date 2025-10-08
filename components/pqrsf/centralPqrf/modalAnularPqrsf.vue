<template>
  <v-dialog max-width="800px" v-model="mostrarModalAnular" persistent>
    <v-card>
      <v-alert
        text
        dense
        border="left"
        type="info"
        icon="mdi-file-document-remove"
        class="text-center"
      >
        <b>Anular PQRF N° {{ pqrsf?.id }}</b>
      </v-alert>
      <v-card-text>
        <v-form ref="formAnularPqrsf">
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                dense
                outlined
                v-model="formAnular.motivo"
                auto-grow
                label="Motivo de Anulación *"
                :rules="[rules.obligatorio, rules.min, rules.max]"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" small dark @click="cerrarModal"> Cerrar </v-btn>
        <v-btn color="success" small dark @click="enviarFormAnularPqrsf">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarModalAnular: {
      type: Boolean,
      default: false,
    },
    pqrsf: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formAnular: {
        motivo: "",
      },
      rules: {
        obligatorio: (value) => !!value || "Este campo es obligatorio.",
        min: (v) =>
          v.length >= 10 || "Este campo debe tener al menos 10 caracteres",
        max: (v) =>
          v.length <= 350 || "Este campo debe tener como máximo 350 caracteres",
      },
    };
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.limpiarFormulario();
      this.$emit("update:mostrarModalAnular", false);
    },

    limpiarFormulario() {
      this.formAnular = {
        motivo: "",
      };
      this.$refs.formAnularPqrsf.resetValidation();
    },
    enviarFormAnularPqrsf() {
      if (!this.$refs.formAnularPqrsf.validate()) {
        return;
      }

      const data = {
        motivo: this.formAnular.motivo,
        afiliado_id: this.pqrsf.afiliado.id,
        pqrsf_id: this.pqrsf.id,
      };

      this.setPreload(true);

      this.$axios
        .post("/formularios-pqrsf/anular", data)
        .then(() => {
          this.$toast.success("PQRF anulada correctamente");
          this.cerrarModal();
          this.$emit("cerrarModal"); // Cerrar el modal del PQRSF
          this.$emit("recargarPQRFs"); // Refrescar la lista de PQRFs
        })
        .catch((error) => {
          this.$toast.error("Error al anular PQRF");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
