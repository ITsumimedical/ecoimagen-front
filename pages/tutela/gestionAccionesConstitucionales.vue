<template>
    <v-card elevation="0">
        <v-row>
            <v-col cols="6">
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="logo horus" height="50px" width="50px" />
                                <span>Módulo gestión de acciones constitucionales</span>
                            </div>
                        </v-toolbar-title>

                    </v-toolbar>
                </v-card-title>
            </v-col>

            <!--BOTON CREAR ACCION CONSTITUCIONAL-->
            <v-col cols="6" class="d-flex justify-start align-center">

                <v-btn-toggle background-color="white" dark>
                    <v-btn color="boton" small  class="ml-2" @click="dialog = true">Crear
                        acción<v-icon right>
                            mdi-plus</v-icon>
                    </v-btn>
                </v-btn-toggle>

                <!--Dialogo crear accion constitucional-->
                <v-dialog persistent v-model="dialog" max-width="1000px">
                    <v-card :loading="preload" :disabled="preload">
                        <v-alert text dense border="left" type="info">Crear acción constitucional</v-alert>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <accionConstitucionalComponent @respuestaComponente="dialog = false, onTabChange(0)" />
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>


        <!--botones para ingresar a cada tipo de gestión-->
        <v-card-text>
            <v-tabs v-model="tab" grow @change="onTabChange">
                <v-tabs-slider :color="sliderColor"></v-tabs-slider>

                <!-- Tab Sin asignar (Rojo) -->
                <v-tab key="gestionNoAsignados" class="sinasignar-tab">
                    <v-icon left class="text-red">mdi-account-convert</v-icon>
                    <span class="text-red">Sin Asignar</span>

                    <v-badge :content="totalNoAsignados" :color="'#FF5252'" class="ml-2 mt-3"></v-badge>
                </v-tab>

                <!-- Tab Asignadas (Azul) -->
                <v-tab key="gestionAsignados" class="asignado-tab">
                    <v-icon left class="text-blue">mdi-account-alert</v-icon>
                    <span class="text-blue">Asignadas</span>
                    <v-badge :content="totalAsignados" :color="'#2196F3'" class="ml-2 mt-3"></v-badge>
                </v-tab>


                <!-- Tab Cerrados temporales (Amarillo) -->
                <v-tab key="gestionCierreTemporal" class="cierretemporal-tab">
                    <v-icon left class="text-yellow">mdi-checkbox-marked-circle-plus-outline</v-icon>
                    <span class="text-yellow">Cerrado Temporal</span>
                    <v-badge :content="totalTemporal" :color="'#FF9800'" class="ml-2 mt-3"></v-badge>
                </v-tab>

                <!-- Tab cerrados (Verde) -->
                <v-tab key="gestionCierreTotal" class="cierretotal-tab">
                    <v-icon left class="text-green">mdi-message-check-outline</v-icon>
                    <span class="text-green">Cerrado total</span>
                    <v-badge :content="totalCierre" :color="'#4CAF50'" class="ml-2 mt-3"></v-badge>
                </v-tab>

                <!--Montar la información del componente seleccionado-->
                <v-tabs-items v-model="tab">
                    <v-tab-item key="gestionNoAsignados">
                        <gestionAcciones ref="gestionNoAsignados" @actualizarContador="actualizarContadorNoAsignados"
                            estados="1" />
                    </v-tab-item>
                    <v-tab-item key="gestionlAsignados">
                        <gestionAcciones ref="gestionAsignados" @actualizarContador="actualizarContadorAsignados"
                            estados="6"></gestionAcciones>
                    </v-tab-item>
                    <v-tab-item key="gestionCierreTemporal">
                        <gestionAcciones ref="gestionCierreTemporal" @actualizarContador="actualizarContadorTemporal"
                            estados="23"></gestionAcciones>
                    </v-tab-item>
                    <v-tab-item key="gestionCierreTotal">
                        <gestionAcciones ref="gestionCierreTotal" @actualizarContador="actualizarContadorTotal"
                            estados="17" />
                    </v-tab-item>
                </v-tabs-items>
            </v-tabs>
        </v-card-text>

    </v-card>
</template>

<script>


import gestionAcciones from "@/pages/tutela/gestionAcciones.vue";
import accionConstitucionalComponent from '@/components/tutela/gestion/tutelaComponente.vue';



export default ({
    middleware({
      $can,
      redirect
    }) {
      if (!$can('tutelas.gestion')) {
        return redirect('/');
      }
    },
    components:{
        gestionAcciones,
        accionConstitucionalComponent
    },
    data() {
        return {
            tab: "gestionNoAsignados",
            totalNoAsignados: '...',
            totalAsignados: '...',
            totalTemporal: '...',
            totalCierre: '...',
            dialog : false,
            preload: false
            
            
        }

    },
    computed: {
        
        sliderColor() {
            switch (this.tab) {
                case 0:
                    return "#ff5252"; // Rojo para no asignadas/
                case 1:
                    return "#2196F3"; // Azul para asignadas
                case 2:
                    return "#FF9800"; // Amarillo para cierres temporales
                case 3:
                    return "#4CAF50"; // Verde para cerradas totales
                default:
                    return "primary"; // Color por defecto
            }
        }

    },
    methods: {
        onTabChange(tab) {
            switch (tab) {
                case 0:
                    //tab 1 sin asignar
                    
                    if (this.$refs.gestionNoAsignados){
                        this.$refs.gestionNoAsignados.listarAcciones();
                    }
                        break;
                case 1:
                    
                    if(this.$refs.gestionAsignados2){
                        this.$refs.gestionAsignados.listarAcciones();
                        
                    }
                        break;
                case 2:
                    
                if(this.$refs.gestionCierreTemporal){
                        this.$refs.gestionCierreTemporal.listarAcciones();
                       
                        
                    }
                    break;
                case 3:
                    
                    if(this.$refs.gestionCierreTotal){
                        this.$refs.gestionCierreTotal.listarAcciones();
                    }
                    break;
                default:
                    
                    break;
            }
        },
        actualizarContadorNoAsignados(total) {
      this.totalNoAsignados = total.toString();
    },
    actualizarContadorAsignados(total){
        this.totalAsignados = total.toString();
    },
    actualizarContadorTemporal(total){
        this.totalTemporal = total.toString();
    },
    actualizarContadorTotal(total){
        this.totalCierre = total.toString();
    }

    }
})
</script>



<style scoped>
.asignado-tab .v-icon,
.asignado-tab span {
    color: #2196f3 !important;
}

.sinasignar-tab .v-icon,
.sinasignar-tab span {
    color: #ff5252 !important;
}

.cierretemporal-tab .v-icon,
.cierretemporal-tab span {
    color: #ff9800 !important;
}

.cierretotal-tab .v-icon,
.cierretotal-tab span {
    color: #4caf50 !important;
}
</style>