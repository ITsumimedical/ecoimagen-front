<template>
  <v-card>
    <v-col col="12" sm="3" md="12">
      <v-alert dense text outlined icon="mdi-school" type="info" color="info">
        <b>Asistencia Educativa</b>
      </v-alert>
    </v-col>
    <v-tabs centered>
      <v-tab>
        <v-icon left>
          mdi-account-school
        </v-icon>
        Crear
      </v-tab>

      <v-tab>
        <v-icon left>
          mdi-book-education
        </v-icon>
        Creadas
      </v-tab>


      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <asistenciaEducativa />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <asistenciasCreadas/>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>


<script>
import Widget from '~/components/widget/Widget.vue'
import asistenciaEducativa from '@/pages/gestionRiesgo/asistenciaEducativa.vue'
import asistenciasCreadas from '@/pages/gestionRiesgo/asistenciasEducativasCreadas.vue'

export default {
  components: {
    Widget,
    asistenciaEducativa,
    asistenciasCreadas
  },
  data() {
    return {
    };
  },
  methods: {
  },
};

</script>
