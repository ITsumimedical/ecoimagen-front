<template>
  <div>
    <v-row >
      <v-col cols="12" sm="12" md="12">

          <v-card-text>
               <v-col cols="12" sm="12" md="12">
              <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                <b>Revisión sarlaft</b>
              </v-alert>
            </v-col>
            </v-card-text>
          <v-row dense>


          <v-col cols="12" sm="6" md="6" >
            <v-card color="red" @click="pendientes=true, revisados=false">
              <v-card-text class="pa-0">
                <v-container class="pa-0">

                  <div class="layout row ma-0">
                    <div class="sm4 xs4 ">
                      <div class="layout column ma-0 justify-center align-center">
                        <v-icon size="76px" color="white" style="opacity: 0.8;">mdi-file-clock-outline</v-icon>
                      </div>
                    </div>
                    <div class="layout column ma-0 justify-center" style="color: white;">
                      <span class="caption">Pendientes</span>
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="6"  >
            <v-card color="success" @click="pendientes=false, revisados=true">
              <v-card-text class="pa-0">
                <v-container class="pa-0">
                  <div class="layout row ma-0">
                    <div class="sm4 xs4 ">
                      <div class="layout column ma-0 justify-center align-center">
                        <v-icon size="76px" color="white" style="opacity: 0.8;">mdi-file-chart-check-outline</v-icon>
                      </div>
                    </div>
                    <div class="layout column ma-0 justify-center" style="color: white;">
                      <span class="caption">Revisados</span>
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
         </v-row>

          <v-row dense v-show="pendientes">
             <v-col cols="12" sm="12" md="12">
              <sarlaftPendientes/>
             </v-col>
          </v-row>
          <v-row dense  v-show="revisados" >
            <v-col cols="12" sm="12" md="12">
              <revisadosSarlaft/>
            </v-col>
          </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import sarlaftPendientes from '~/pages/sarlaft/sarlaftPendientes.vue';
  import revisadosSarlaft from '~/pages/sarlaft/revisadosSarlaft.vue';
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    components: {
      sarlaftPendientes,
      revisadosSarlaft,

    },
    name: 'WorkspaceJsonAuditoria',
    data() {
      return {
        pendientes: false,
        revisados:false,

      };
    },

    mounted() {

    },

    methods: {
    },
  };

</script>

