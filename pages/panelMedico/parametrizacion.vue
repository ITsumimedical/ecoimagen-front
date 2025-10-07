<template>
  <v-card>
    <v-tabs centered next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows>
      <v-tab v-for="(componente,index) in componentes" :key="index">
       {{index}}
      </v-tab>
      <v-tab-item v-for="(componente) in componentes" :key="componente">
        <v-card flat>
          <component :is="componente"></component>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import RecomendacionCupsPage from '~/pages/panelMedico/recomendacionCups.vue';
import procesosOdontograma from '~/components/panelMedico/procesosOdontograma.vue';
import planCuidado from "~/components/panelMedico/planCuidado.vue";
import parametrizacionHistoria from "@/components/panelMedico/parametrizacionTipoHistoriasClinicas/parametrizacionTipoHistoriaComponente.vue"
export default {
  name: 'WorkspaceJsonParametrizacion',
  components: {
      RecomendacionCupsPage,
      procesosOdontograma,
      planCuidado,
      parametrizacionHistoria,
    },

  data() {
    return {
      componentes:{
        'Recomendaciones Cups':'RecomendacionCupsPage',
        'Procesos Odontograma':'procesosOdontograma',
        'Plan Cuidado':'planCuidado',
        'Parametrizacion Tipos Historia' : 'parametrizacionHistoria',
      }
    };
  },

  mounted() {

  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
