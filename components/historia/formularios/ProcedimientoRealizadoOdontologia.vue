<template>
  <div>
    <v-form ref="ProcedimientoRealizado" lazy-validation>
      <v-col cols="12" sm="12" md="12">
        <v-alert
          class="text-center"
          dense
          text
          outlined
          type="info"
          icon="mdi-book-open-page-variant"
        >
          <b>PROCEDIMIENTO REALIZADO</b></v-alert
        >
        <v-row demse>
          <v-col cols="12" sm="12" md="12">
            <v-textarea
              outlined
              auto-grow
              v-model="procedimiento.procedimiento_realizado_odontologia"
              label="Procedimiento Realizado"
              required
              :rules="[
                (v) => !!v || 'El campo Procedimiento Realizado es requerido',
              ]"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row dense v-if="datos.cita.tipo_historia_id === 18">
          <v-checkbox
            color="primary"
            label="Paciente controlado?"
            v-model="procedimiento.paciente_controlado_odontologia"
          ></v-checkbox>
        </v-row>
      </v-col>
    </v-form>
  </div>
</template>
<script>
export default {
  name: "ProcedimientoRealizadoOdontologia",
  props: ["datos", "resumen"],
  data() {
    return {
      procedimiento: {
        procedimiento_realizado_odontologia: "",
        paciente_controlado_odontologia: false,
      },
    };
  },
  created() {
    this.procedimiento = this.resumen;
  },
  methods: {
    validarErrores() {
      return this.$refs.ProcedimientoRealizado.validate();
    },
  },
};
</script>