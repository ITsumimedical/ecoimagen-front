<template>
    <div>
        <v-card flat>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Gestión</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-tabs v-model="tab" grow @change="onToChange">
                    <v-tabs-slider :color="sliderColor"></v-tabs-slider>

                    <!-- Tab Asignadas (Azul) -->
                    <v-tab key="misBarreras" class="misBarreras-tab">
                        <v-icon left class="text-blue">mdi-home-account</v-icon>
                        <span class="text-blue">Mis Barreras</span>
                        <v-badge :content="totalAsignados" :color="'#2196F3'" class="ml-2 mt-3"></v-badge>
                    </v-tab>

                    <!-- Tab Asignadas (Azul) -->
                    <v-tab key="barrerasAsignados" class="asignados-tab">
                        <v-icon left class="text-blue">mdi-account-check</v-icon>
                        <span class="text-blue">Asignadas</span>
                        <v-badge :content="totalAsignados" :color="'#FF9800'" class="ml-2 mt-3"></v-badge>
                    </v-tab>


                    <!-- Tab Solucionadas (Verde) -->
                    <v-tab key="barrerasSolucionadas" class="solucionadas-tab">
                        <v-icon left class="text-green">mdi-message-check-outline</v-icon>
                        <span class="text-green">Gestionadas / Anuladas</span>
                        <v-badge :content="totalSolucionadas" :color="'#4CAF50'" class="ml-2 mt-3"></v-badge>
                    </v-tab>

                    <v-tabs-items v-model="tab">
                        <v-tab-item key="misBarreras">
                            <MisBarrerasReportadas></MisBarrerasReportadas>
                        </v-tab-item>
                        <v-tab-item key="barrerasAsignados">
                            <UserBarrerasAsignadas ref="barrerasAsignados"/>
                        </v-tab-item>
                        <v-tab-item key="barrerasSolucionadas">
                            <UserBarrerasSolucionas ref="barrerasSolucionadas"/>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import MisBarrerasReportadas from '~/components/barreraAcceso/gestion/misBarrerasReportadas.vue';
import UserBarrerasAsignadas from '~/components/barreraAcceso/gestion/userBarrerasAsignadas.vue';
import UserBarrerasSolucionas from '~/components/barreraAcceso/gestion/userBarrerasSolucionas.vue';

export default {
    components: {
        UserBarrerasAsignadas,
        UserBarrerasSolucionas,
        MisBarrerasReportadas
    },
    data() {
        return {
            tab: "barrerasPendientes",
            totalAsignados: "!",
            totalSolucionadas: "!",
        }
    },
    computed: {
        sliderColor() {
            switch (this.tab) {
                case 0:
                    return "#2196F3"; // Azul para mis barreras
                case 1:
                    return "#FF9800"; // Amarillo para asignadas
                case 2:
                    return "#4CAF50"; // Verde para solucionadas
                default:
                    return "primary"; // Color por defecto
            }
        },
    },
    methods: {
        ...mapActions('app', ['setPreload']),
        onToChange(tab) {
            switch (tab) {
                case 0: // Primer tab (Mis Barreras)
                    if (this.$refs.misBarreras) {
                        this.$refs.barrerasAsignados.listarBarrerasRegistradasUser();
                    }
                    break;
                case 1: // Segundo tab (Asignadas)
                    if (this.$refs.barrerasAsignados) {
                        this.$refs.barrerasAsignados.listarBarrerasAsignadas();
                    }
                    break;
                case 2: // Tercero tab (Solucionadas)
                    if (this.$refs.barrerasSolucionadas) {
                        this.$refs.barrerasSolucionadas.listarSolucionadasAnuladas();
                    }
                    break;
                default:
                    console.log("Tab no encontrado");
                    break;
            }
        }
    }
}
</script>

<style scoped>
.asignados-tab .v-icon,
.asignados-tab span {
    color: #ff9800 !important;
}

.misBarreras-tab .v-icon,
.misBarreras-tab span {
    color: #2196f3 !important;
}

.solucionadas-tab .v-icon,
.solucionadas-tab span {
    color: #4caf50 !important;
}
</style>
