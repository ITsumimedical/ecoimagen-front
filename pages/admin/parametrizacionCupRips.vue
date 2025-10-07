<template>
  <div>
    <v-card>
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px">
              <span>Parametrizacion Rips</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>

      <v-row>
        <v-col cols="12" sm="4">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-alert dense text v-bind="attrs" v-on="on" @click="comp = 'modalidad'" color="blue darken-4"
                icon="mdi-cash-multiple" border="right">
                <b> Modalidad Grupo Servicio </b>
              </v-alert>
            </template>
            <span>Haz clic aquí</span>
          </v-tooltip>
        </v-col>

        <v-col cols="12" sm="4">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-alert dense text v-bind="attrs" v-on="on" @click="comp = 'grupo'" color="blue darken-4"
                icon="mdi-cash-multiple" border="right">
                <b> Grupo Servicios </b>
              </v-alert>
            </template>
            <span>Haz clic aquí</span>
          </v-tooltip>
        </v-col>

        <v-col cols="12" sm="4">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-alert dense text v-bind="attrs" v-on="on" @click="comp = 'codigo'" color="blue darken-4"
                icon="mdi-cash-multiple" border="right">
                <b> Codigo Servicios </b>
              </v-alert>
            </template>
            <span>Haz clic aquí</span>
          </v-tooltip>
        </v-col>

        <v-col cols="12" sm="4">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-alert dense text v-bind="attrs" v-on="on" @click="comp = 'finalidad'" color="blue darken-4"
                icon="mdi-cash-multiple" border="right">
                <b> Finalidad Consulta </b>
              </v-alert>
            </template>
            <span>Haz clic aquí</span>
          </v-tooltip>
        </v-col>



        <v-col cols="12" sm="4">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-alert dense text v-bind="attrs" v-on="on" @click="comp = 'CausaConsulta'" color="blue darken-4"
                icon="mdi-cash-multiple" border="right">
                <b> Causa Consulta Externa </b>
              </v-alert>
            </template>
            <span>Haz clic aquí</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <component :is="comp"></component>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  import modalidad from '~/components/admin/ParametrizacionCupsRips/modalidadGrupoServicioTecSal.vue';
  import grupo from '~/components/admin/ParametrizacionCupsRips/grupoServicios.vue';
  import codigo from '~/components/admin/ParametrizacionCupsRips/codigoServicio.vue';
  import finalidad from '~/components/admin/ParametrizacionCupsRips/finalidadConsulta.vue';
  import CausaConsulta from '~/components/admin/ParametrizacionCupsRips/consultaCausaExterna.vue';

  export default {
    components: {
      modalidad,
      grupo,
      codigo,
      finalidad,
      CausaConsulta
    },
    data() {
      return {
        comp: 'modalidad',
      }
    },

  }

</script>
