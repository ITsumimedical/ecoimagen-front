<template>
  <div>
    <v-card>
    <v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px">
							<span>Epicrisis</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title>
      <v-tabs next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows grow v-model="activeTab">
        <v-tab>
          Pendientes
        </v-tab>
        <v-tab>
          Historico
        </v-tab>
        <v-tab-item>
              <EpicrisisComponent :ejecutar="activeTab === 0"/>
        </v-tab-item>
        <v-tab-item>
              <HistoricoEpicrisisComponent :ejecutar="activeTab === 1"/>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
  import EpicrisisComponent from "../../components/panelMedico/urgencias/EpicrisisComponent.vue";
  import HistoricoEpicrisisComponent from "../../components/panelMedico/urgencias/HistoricoEpicrisisComponent.vue";
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
      EpicrisisComponent,
      HistoricoEpicrisisComponent,
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
