<template>
  <v-card>
    <v-col col="12" sm="12" md="12">
      <v-alert dense text color="info" icon="mdi-medication"><b>Enfermeria oncologica</b>
      </v-alert>
    </v-col>
    <v-tabs grow>
      <v-tab @click="agendar=true">
        Agendar Cita
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <agendarOncologia :ejecutar="agendar" />
          </v-card-text>
        </v-card>
      </v-tab-item>

    </v-tabs>
  </v-card>
</template>

<script>
  import agendarOncologia from '~/components/agendamientoOncologia/agendamientoOncologia.vue'

  export default {
    components: {
      agendarOncologia,
    },
    data() {
      return {
        agendar: false,
      };
    },

  };

</script>
