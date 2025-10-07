<template>
    <div>
        <v-card flat>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Gestión Interna</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>

                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-tabs v-model="tab" grow @change="onToChange">
                    <v-tabs-slider :color="sliderColor"></v-tabs-slider>

                    <!-- Tab Pendientes (Rojo) -->
                    <v-tab key="barrerasPendientes" class="pendientes-tab">
                        <v-icon left class="text-red">mdi-account-alert</v-icon>
                        <span class="text-red">Pendientes</span>
                        <v-badge :content="totalPendientes" :color="'#FF5252'" class="ml-2 mt-3"></v-badge>
                    </v-tab>

                    <!-- Tab Asignadas (Azul) -->
                    <v-tab key="barrerasAsignados" class="asignados-tab">
                        <v-icon left class="text-blue">mdi-account-multiple-check</v-icon>
                        <span class="text-blue">Asignadas</span>
                        <v-badge :content="totalAsignados" :color="'#2196F3'" class="ml-2 mt-3"></v-badge>
                    </v-tab>

                    <!-- Tab Pre-Solucionadas (Amarillo) -->
                    <v-tab key="barrerasPreSolucionadas" class="presolucionadas-tab">
                        <v-icon left class="text-yellow">mdi-checkbox-marked-circle-plus-outline</v-icon>
                        <span class="text-yellow">Pre-Gestionadas</span>
                        <v-badge :content="totalPreSolucionadas" :color="'#FF9800'" class="ml-2 mt-3"></v-badge>
                    </v-tab>

                    <!-- Tab Solucionadas (Verde) -->
                    <v-tab key="barrerasSolucionadas" class="solucionadas-tab">
                        <v-icon left class="text-green">mdi-message-check-outline</v-icon>
                        <span class="text-green">Gestionadas / Anuladas</span>
                        <v-badge :content="totalSolucionadas" :color="'#4CAF50'" class="ml-2 mt-3"></v-badge>
                    </v-tab>

                    <v-tabs-items v-model="tab">
                        <v-tab-item key="barrerasPendientes">
                            <BarrerasPendientes ref="barrerasPendientes"
                                @actualizarConteo="actualizarContadorPendientes" />
                        </v-tab-item>
                        <v-tab-item key="barrerasAsignados">
                            <BarrerasAsignadas ref="barrerasAsignados"
                                @actualizarConteo="actualizarContadorAsignados" />
                        </v-tab-item>
                        <v-tab-item key="barrerasPreSolucionadas">
                            <BarrerasPresolucionadas ref="barrerasPreSolucionadas"
                                @actualizarConteo="actualizarContadorPreSolucionados" />
                        </v-tab-item>
                        <v-tab-item key="barrerasSolucionadas">
                            <BarrerasSolucionadas ref="barrerasSolucionadas"
                                @actualizarConteo="actualizarContadorSolucionados" />
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import BarrerasAsignadas from '~/components/barreraAcceso/gestionInterna/barrerasAsignadas.vue';
import BarrerasPendientes from '~/components/barreraAcceso/gestionInterna/barrerasPendientes.vue';
import BarrerasPresolucionadas from '~/components/barreraAcceso/gestionInterna/barrerasPresolucionadas.vue';
import BarrerasSolucionadas from '~/components/barreraAcceso/gestionInterna/barrerasSolucionadas.vue';

export default {
    components: {
        BarrerasAsignadas,
        BarrerasPendientes,
        BarrerasPresolucionadas,
        BarrerasSolucionadas,
    },
    data() {
        return {
            tab: "barrerasPendientes",
            totalPendientes: "!",
            totalAsignados: "!",
            totalPreSolucionadas: "!",
            totalSolucionadas: "!",
        }
    },
    computed: {
        sliderColor() {
            switch (this.tab) {
                case 0:
                    return "#FF5252"; // Rojo para pendientes
                case 1:
                    return "#2196F3"; // Azul para asignadas
                case 2:
                    return "#FF9800"; // Amarillo para pre-solucionadas
                case 3:
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
                case 0: // Primer tab (Pendientes)
                    if (this.$refs.barrerasPendientes) {
                        this.$refs.barrerasPendientes.listarBarrerasPendientes();
                    }
                    break;
                case 1: // Segundo tab (Asignadas)
                    if (this.$refs.barrerasAsignados) {
                        this.$refs.barrerasAsignados.listarBarrerasAsignadas();
                    }
                    break;
                case 2: // Tercer tab (Pre-Solucionadas)
                    if (this.$refs.barrerasPreSolucionadas) {
                        this.$refs.barrerasPreSolucionadas.listarBarrerasPresolucionadas();
                    }
                    break;
                case 3: // Cuarto tab (Solucionadas)
                    if (this.$refs.barrerasSolucionadas) {
                        this.$refs.barrerasSolucionadas.listarSolucionadasAnuladas();
                    }
                    break;
                default:
                    console.log("Tab no encontrado");
                    break;
            }
        },

        actualizarContadorPendientes(total) {
            this.totalPendientes = total.toString();
        },

        actualizarContadorAsignados(total) {
            this.totalAsignados = total.toString();
        },

        actualizarContadorPreSolucionados(total) {
            this.totalPreSolucionadas = total.toString();
        },

        actualizarContadorSolucionados(total) {
            this.totalSolucionadas = total.toString();
        },


    }
}
</script>

<style scoped>
.pendientes-tab .v-icon,
.pendientes-tab span {
    color: #ff5252 !important;
}

.asignados-tab .v-icon,
.asignados-tab span {
    color: #2196f3 !important;
}

.presolucionadas-tab .v-icon,
.presolucionadas-tab span {
    color: #ff9800 !important;
}

.solucionadas-tab .v-icon,
.solucionadas-tab span {
    color: #4caf50 !important;
}
</style>
