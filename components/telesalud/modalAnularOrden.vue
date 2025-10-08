<template>
  <div>
    <v-dialog v-model="mostrarModalAnular" max-width="700" persistent>
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="info"
          icon="mdi-forum-remove-outline"
          class="text-center"
        >
          <b>Anular Orden</b>
        </v-alert>
        <v-card-text>
          <v-form ref="formAnularOrden">
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  auto-grow
                  dense
                  v-model="formAnular.observacion"
                  label="Observación"
                  outlined
                  :rules="[
                    (v) => !!v || 'Este campo es requerido',
                    (v) => v.length >= 10 || 'Mínimo 10 caracteres',
                    (v) => v.length <= 500 || 'Máximo 500 caracteres',
                  ]"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark small @click="cerrarModal()">Cerrar</v-btn>
          <v-btn color="success" dark small @click="anularOrden()"
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
    mostrarModalAnular: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formAnular: {
        observacion: "",
      },
    };
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.$refs.formAnularOrden.resetValidation();
      this.$emit("update:mostrarModalAnular", false);
    },
    anularOrden() {
      if (!this.$refs.formAnularOrden.validate()) {
        return;
      }

      const data = {
        tipo: this.item.tipo === "Medicamento" ? 1 : 2,
        id: this.item.id,
        observacion: this.formAnular.observacion,
        estado: 5,
      };

      this.setPreload(true);
      this.$axios
        .post("/auditoria/cambiar-auditoria-estado", data)
        .then(() => {
          this.$toast.success("Orden anulada con éxito");
          this.$emit("buscarOrdenes");
          this.cerrarModal();
        })
        .catch(() => {
          this.$toast.error("Error al anular la orden");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
