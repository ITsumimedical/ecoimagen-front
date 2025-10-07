<template>
  <div>
    <v-card>
    <v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px">
							<span>Formato Referencia</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title>
      <v-tabs next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows grow  v-model="activeTab">
        <v-tab >
          Pendientes
        </v-tab>
        <v-tab>
          Historico
        </v-tab>
        <v-tab-item >
              <FormatoReferenciaComponent :ejecutar="activeTab === 0" />
        </v-tab-item>
        <v-tab-item>
              <HistoricoFormatoReferenciaComponent :ejecutar="activeTab === 1" />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
  import FormatoReferenciaComponent from "../../components/panelMedico/urgencias/FormatoReferenciaComponent.vue";
  import HistoricoFormatoReferenciaComponent from "../../components/panelMedico/urgencias/HistoricoFormatoReferenciaComponent.vue";
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'FrontHorusParametrizacion',
    components: {
      FormatoReferenciaComponent,
      HistoricoFormatoReferenciaComponent,
    },
    data() {
      return {
        activeTab:0,
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
