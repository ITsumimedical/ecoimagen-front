<template>
  <div>
    <v-dialog v-model="mostrarDomicilioModal" persistent max-width="700px">
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="info"
          icon="mdi-truck-fast"
          class="text-center"
        >
          <b>Dispensación a Domicilio</b>
        </v-alert>
        <v-card-text>
          <v-form ref="formDispensarDomicilio">
            <v-row dense>
              <v-col cols="12" md="12" sm="12" class="mt-2">
                <v-select
                  dense
                  outlined
                  label="Dispensación a Domicilio"
                  :items="['Si', 'No']"
                  v-model="formDomicilio.domicilio"
                  :rules="[(v) => !!v || 'Este campo es requerido']"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                md="12"
                sm="12"
                v-if="formDomicilio.domicilio === 'Si'"
              >
                <v-select
                  dense
                  outlined
                  label="Tipo de Domicilio"
                  :items="['Interno', 'Externo']"
                  v-model="formDomicilio.tipo_domicilio"
                  :rules="[(v) => !!v || 'Este campo es requerido']"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark small @click="cerrarModal()">Cerrar</v-btn>
          <v-btn color="success" dark small @click="guardarDomicilio()"
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
    mostrarDomicilioModal: {
      type: Boolean,
      required: true,
    },
    articulo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formDomicilio: {
        domicilio: null,
        tipo_domicilio: null,
      },
    };
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.limpiarFormulario();
      this.$emit("update:mostrarDomicilioModal", false);
    },

    limpiarFormulario() {
      this.formDomicilio = {
        domicilio: null,
        tipo_domicilio: null,
      };

      this.$refs.formDispensarDomicilio.resetValidation();
    },

    guardarDomicilio() {
      if (!this.$refs.formDispensarDomicilio.validate()) {
        return;
      }

      const data = {
        domicilio: this.formDomicilio.domicilio === "Si" ? true : false,
        tipo_domicilio:
          this.formDomicilio.domicilio === "Si"
            ? this.formDomicilio.tipo_domicilio
            : null,
      };

      this.setPreload(true);
      this.$axios
        .post(`/ordenamiento/parametrizarDomicilio/${this.articulo.id}`, data)
        .then(() => {
          this.$toast.success(
            "Parametrización a Domicilio guardada con éxito."
          );
          this.$emit("listarOrdenArticulos", this.articulo.orden_id);
          this.cerrarModal();
        })
        .catch(() => {
          this.$toast.error("Error al guardar Parametrización a Domicilio.");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
