<template>
  <div>
    <v-card>
    <v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px">
							<span>Camas</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title>
      <v-tabs next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows grow v-model="activeTab">
        <v-tab>
          Pabellones
        </v-tab>
        <v-tab>
          Camas
        </v-tab>
        <v-tab-item>
              <PabellonComponent :ejecutar="activeTab === 0"/>
        </v-tab-item>
        <v-tab-item>
              <CamasComponent :ejecutar="activeTab === 1"/>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
  import PabellonComponent from "../../components/camas/pabellonComponent.vue";
  import CamasComponent from "../../components/camas/camasComponent.vue";
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
      PabellonComponent,
      CamasComponent,
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
