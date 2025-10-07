<template>
  <div>
    <v-bottom-navigation v-model="value" color="primary" >
      <v-btn value="pendiente" @click="(solicitudesPendientes = true) && (solicitudesSolucionadas = false)">
        <span>Pendientes</span>
        <v-icon>mdi-account-clock</v-icon>
      </v-btn>

      <v-btn value="solucionado" @click="(solicitudesSolucionadas = true) && (solicitudesPendientes = false)">
        <span>Solucionados</span>
        <v-icon>mdi-account-check</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-divider></v-divider>
    <v-card v-if="solicitudesPendientes == true">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="5">
            <v-text-field append-icon="mdi-magnify" label="Buscar" single-line hide-details>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table :headers="headers" class="elevation-1"></v-data-table>
    </v-card>

    <v-card v-if="solicitudesSolucionadas == true">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="5">
            <v-text-field append-icon="mdi-magnify" label="Buscar" single-line hide-details>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table :headers="headersSolved" class="elevation-1">
      </v-data-table>
    </v-card>

  </div>
</template>



<script>
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    data() {
      return {
        value: 'pendiente',
        headers: [{
            text: 'Id',
          },
          {
            text: 'Asunto',
            value: '',
          },
          {
            text: 'Fecha',
            value: '',
          },
          {
            text: 'Prioridad',
          },
          {
            text: 'Semaforo',
          },
          {
            text: 'Estado',
          },
          {
            text: 'Acciones',
          },
        ],
        headersSolved: [{
            text: 'Id',
          },
          {
            text: 'Asunto',
          },
          {
            text: 'Fecha',
          },
          {
            text: 'Prioridad',
          },
          {
            text: 'Estado',
          },
          {
            text: 'Acciones',
          },
        ],
        solicitudesPendientes: false,
        solicitudesSolucionadas: false,
      };
    },

    created(){
      this.solicitudesPendientes = true
    },

    methods:
    {

    },

  };

</script>

<style lang="scss" scoped>

</style>
