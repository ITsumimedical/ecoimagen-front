<template>
  <div>
    <!-- módulo de recomendaciones CUPS y CIE10 -->
    <v-card elevation="0">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
              <span>Recomendaciones CUPS - CIE10</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>

      <!-- tabs -->
      <v-tabs grow>
        <v-tab>
          <v-icon left>
            mdi-stethoscope
          </v-icon>
          CIE10
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-room-service
          </v-icon>
          CUPS
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <RecomendacionesCie10 />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <RecomendacionesCups />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
  import RecomendacionesCie10 from '~/components/admin/Recomendaciones/RecomendacionesCie10.vue';
  import RecomendacionesCups from '~/components/admin/Recomendaciones/RecomendacionesCups.vue';
  export default {
    components: {
      RecomendacionesCie10,
      RecomendacionesCups
    },
    name: 'WorkspaceJsonRecomendaciones',

    data() {
      return {

      };
    },

    mounted() {

    },

    methods: {

    },
  };

</script>
