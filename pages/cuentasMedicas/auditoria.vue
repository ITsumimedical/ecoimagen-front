<template>
  <div>
    <v-row >
      <v-col cols="12" sm="12" md="12">
        <!-- <v-card> -->

          <v-card-text>
               <v-col cols="12" sm="12" md="12">
              <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                <b>ASIGNACIÓN DE FACTURAS</b>
              </v-alert>
            </v-col>
            </v-card-text>
          <v-row dense>


          <v-col cols="12" sm="6" md="3"  v-if="$can('cuentasMedicas.asignadas')">
            <v-card color="#00b297" @click="asignados=true, auditados=false,facturasPrestador=false,auditoriaFinal=false">
              <v-card-text class="pa-0">
                <v-container class="pa-0">

                  <div class="layout row ma-0">
                    <div class="sm4 xs4 ">
                      <div class="layout column ma-0 justify-center align-center">
                        <v-icon size="76px" color="white" style="opacity: 0.8;">mdi-file-clock-outline</v-icon>
                      </div>
                    </div>
                    <div class="layout column ma-0 justify-center" style="color: white;">
                      <span class="caption">Asignadas</span>
                      <div class="headline">{{ contador.asignadas }}</div>
                      <span class="caption">Hasta la fecha</span>
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3"  v-if="$can('cuentasMedicas.auditadas')">
            <v-card color="#F1C40F" @click="asignados=false, auditados=true,facturasPrestador=false,auditoriaFinal=false">
              <v-card-text class="pa-0">
                <v-container class="pa-0">
                  <div class="layout row ma-0">
                    <div class="sm4 xs4 ">
                      <div class="layout column ma-0 justify-center align-center">
                        <v-icon size="76px" color="white" style="opacity: 0.8;">mdi-file-chart-check-outline</v-icon>
                      </div>
                    </div>
                    <div class="layout column ma-0 justify-center" style="color: white;">
                      <span class="caption">Auditadas</span>
                      <div class="headline">{{ contador.auditas }}</div>
                      <span class="caption">Hasta la fecha</span>
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3" v-if="$can('cuentasMedicas.facturasPrestador')">
            <v-card color="#E64F07" @click="asignados=false, auditados=false,facturasPrestador=true,auditoriaFinal=false">
              <v-card-text class="pa-0">
                <v-container class="pa-0">
                  <div class="layout row ma-0">
                    <div class="sm4 xs4 ">
                      <div class="layout column ma-0 justify-center align-center">
                        <v-icon size="76px" color="white" style="opacity: 0.8;">mdi-file-account-outline</v-icon>
                      </div>
                    </div>
                    <div class="layout column ma-0 justify-center" style="color: white;">
                      <span class="caption">Facturas prestador</span>
                      <div class="headline">{{ contador.prestador }}</div>
                      <span class="caption">Hasta la fecha</span>
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3" v-if="$can('cuentasMedicas.auditoriaFinal')">
            <v-card color="primary" @click="asignados=false, auditados=false,facturasPrestador=false,auditoriaFinal=true">
              <v-card-text class="pa-0">
                <v-container class="pa-0">
                  <div class="layout row ma-0">
                    <div class="sm4 xs4 ">
                      <div class="layout column ma-0 justify-center align-center">
                        <v-icon size="76px" color="white" style="opacity: 0.8;">mdi-file-lock-outline</v-icon>
                      </div>
                    </div>
                    <div class="layout column ma-0 justify-center" style="color: white;">
                      <span class="caption">Auditoría final</span>
                      <div class="headline">{{ contador.auditoriaFinal }}</div>
                      <span class="caption">Hasta la fecha</span>
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>

         </v-row>

          <v-row dense v-show="asignados">
             <v-col cols="12" sm="12" md="12">
              <asignadasPage @updateCount="contadorFacturas" :ejecutar="asignados"/>
             </v-col>
          </v-row>
          <v-row dense  v-show="auditados" >
            <v-col cols="12" sm="12" md="12">
              <auditadasPage @updateCount="contadorFacturas" :ejecutar="auditados" />
            </v-col>
          </v-row>
          <v-row dense v-show="facturasPrestador">
            <v-col cols="12" sm="12" md="12">
              <prestadorPage @updateCount="contadorFacturas" :ejecutar="facturasPrestador"/>
            </v-col>
          </v-row>
          <v-row dense v-show="auditoriaFinal">
            <v-col cols="12" sm="12" md="12">
              <auditoriaFinalPage @updateCount="contadorFacturas" :ejecutar="auditoriaFinal"/>
            </v-col>
          </v-row>
        <!-- </v-card> -->

      </v-col>
    </v-row>
  </div>
</template>

<script>
  import asignadasPage from '~/pages/cuentasMedicas/asignadas.vue';
  import auditadasPage from '~/pages/cuentasMedicas/auditadas.vue';
  import prestadorPage from '~/pages/cuentasMedicas/prestador.vue';
  import auditoriaFinalPage from '~/pages/cuentasMedicas/auditoriaFinal.vue';
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('cuentasMedicas.auditoria')) {
        return redirect('/');
      }
    },
    components: {
      asignadasPage,
      auditadasPage,
      prestadorPage,
      auditoriaFinalPage

    },
    name: 'WorkspaceJsonAuditoria',
    data() {
      return {
        contador: '',
        asignados: false,
        auditados:false,
        facturasPrestador:false,
        auditoriaFinal:false
      };
    },

    mounted() {
      this.contadorFacturas()
    },

    methods: {

      contadorFacturas() {
        this.$axios('factura/contadorFacturas').then(res => {
          this.contador = res.data
        })
      }
    },
  };

</script>

