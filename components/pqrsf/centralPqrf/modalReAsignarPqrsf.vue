<template>
  <v-dialog max-width="800px" v-model="mostrarModalReAsignar" persistent>
    <v-card>
      <v-alert
        text
        dense
        border="left"
        color="info"
        icon="mdi-account-convert"
        class="text-center"
      >
        <b>Reasignar PQRF N° {{ pqrsf?.id }}</b>
      </v-alert>
      <v-card-text>
        <v-form ref="formReAsignarPqrsf">
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete
                v-model="formReAsignar.areasSeleccionadas"
                :items="opcionesAreas"
                label="Areas *"
                item-text="nombre"
                item-value="id"
                chips
                deletable-chips
                small-chips
                clearable
                multiple
                :rules="[rules.obligatorio]"
                dense
                outlined
                :loading="loading.opcionesAreas"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                auto-grow
                v-model="formReAsignar.motivo"
                label="Motivo de reasignación *"
                clearable
                :rules="[rules.obligatorio]"
                dense
                outlined
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" small dark @click="cerrarModal">Cerrar</v-btn>
        <v-btn color="success" small @click="enviarFormuarioPqrsf">
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
    mostrarModalReAsignar: {
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
      formReAsignar: {
        areasSeleccionadas: null,
        motivo: null,
      },
      rules: {
        obligatorio: (value) =>
          !!value || "Este campo es obligatorio.",
      },
      opcionesAreas: [],
      loading: {
        opcionesAreas: false,
      },
    };
  },
  watch: {
    mostrarModalReAsignar(newValue) {
      if (newValue) {
        this.listarAreas();
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.limpiarFormulario();
      this.$emit("update:mostrarModalReAsignar", false);
    },

    limpiarFormulario() {
      this.formReAsignar = {
        areasSeleccionadas: null,
        motivo: null,
      };

      this.$refs.formReAsignarPqrsf.resetValidation();
    },

    enviarFormuarioPqrsf() {
      if (!this.$refs.formReAsignarPqrsf.validate()) {
        return;
      }

      const data = {
        afiliado_id: this.pqrsf.afiliado.id,
        numero_documento: this.pqrsf.afiliado.numero_documento,
        pqrsf_id: this.pqrsf.id,
        area: this.formReAsignar.areasSeleccionadas,
        motivo: this.formReAsignar.motivo,
      };

      this.setPreload(true);

      this.$axios
        .post("/formularios-pqrsf/reasignar", data)
        .then((res) => {
          this.$toast.success("PQRF asignada con éxito.");
          this.limpiarFormulario();
          this.cerrarModal();
          this.$emit("cerrarModal"); // Cerrar el modal del PQRSF
          this.$emit("recargarPQRFs"); // Refrescar la lista de PQRFs
        })
        .catch((error) => {
          this.$toast.error("Error al asignar PQRF");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    listarAreas() {
      this.loading.opcionesAreas = true;
      this.$axios
        .post("/area-responsable-pqrsf/listar")
        .then((res) => {
          this.opcionesAreas = res.data;
        })
        .catch((err) => {
          this.$toast.error("Error al cargar las áreas");
        })
        .finally(() => {
          this.loading.opcionesAreas = false;
        });
    },
  },
};
</script>
