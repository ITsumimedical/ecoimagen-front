<template>
  <div>
    <v-dialog v-model="mostrarModalSuspender" persistent max-width="800px">
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="warning"
          icon="mdi-close-circle"
        >
          <b>Suspender Medicamento</b>
        </v-alert>
        <v-card-text>
          <v-form ref="formSuspensionMedicamento" @submit.prevent="suspender">
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  outlined
                  v-model="formSuspension.motivo"
                  auto-grow
                  label="Motivo de Suspensión"
                  :rules="[
                    () => !!formSuspension.motivo || 'El campo es requerido',
                    () =>
                      formSuspension.motivo.length >= 10 ||
                      'Debe contener al menos 10 caracteres',
                  ]"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
          <v-btn color="success" small @click="suspenderMedicamento">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    mostrarModalSuspender: Boolean,
    orden: Number,
    ordenArticulo: Number,
    codesumi: Number,
    afiliado: Number,
  },
  data() {
    return {
      formSuspension: {
        motivo: "",
      },
    };
  },
  methods: {
    cerrarModal() {
      this.$emit("update:mostrarModalSuspender", false);
      this.limpiarForm();
    },

    suspenderMedicamento() {
      const data = {
        codesumi: this.codesumi,
        orden: this.orden,
        ordenArticulo: this.ordenArticulo,
        motivo: this.formSuspension.motivo,
      };

      if (this.$refs.formSuspensionMedicamento.validate()) {
        this.$emit("suspenderMedicamento", data);
        this.limpiarForm();
      } else {
        this.$toast.error("Debe ingresar el motivo de la suspensión");
      }
    },

    limpiarForm() {
      this.formSuspension = {
        motivo: "",
      };
      this.$refs.formSuspensionMedicamento.resetValidation();
    },
  },
};
</script>
