<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Panel de Atención Médica</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-container fluid>
                <v-row class="justify-center" dense>
                    <v-col v-for="item in opciones" :key="item.titulo" cols="12" sm="6" md="4" lg="2">
                        <v-card :elevation="comp === item.componente ? 12 : 2"
                            :color="comp === item.componente ? '#B0BEC5' : '#ECEFF1'" class="card-panel pa-3 d-flex flex-column justify-space-between align-center"
                            style="height: 160px; width: 150px;"
                            @click="item.accion">
                            <v-card-text class="d-flex flex-column align-center text-center">
                                <v-icon color="#0288D1" size="32">{{ item.icono }}</v-icon>
                                <div class="mt-2 text-subtitle-2 font-weight-medium">
                                    {{ item.titulo }}
                                </div>
                                <v-badge v-if="item.contador !== null" :content="item.contador || '0'" color="#0288D1"
                                    overlap class="mt-2" />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-card elevation="2" class="mt-4">
                    <component :is="comp" @actualizarContadores="contadorConsultasNoProgramadas" />
                </v-card>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import AtencionMedica from "~/components/panelMedico/atencionMedica.vue";
import NoProgramadas from "~/components/panelMedico/noProgramadas.vue";
import OcupacionalComponent from "~/components/panelMedico/ocupacionalComponent.vue";
import grupalesComponente from "~/components/panelMedico/grupalesComponente.vue";
import triageComponent from "~/components/panelMedico/triageComponent.vue";

export default {
    middleware({ $can, redirect }) {
        if (!$can("panelmedico.atenciones.vista")) {
            return redirect("/");
        }
    },
    name: "atencion",
    components: {
        AtencionMedica,
        NoProgramadas,
        OcupacionalComponent,
        grupalesComponente,
        triageComponent,
    },
    data() {
        return {
            comp: "AtencionMedica",
            contadorConsultasIndividuales: 0,
            contadorOcupacional: 0,
            contadorNoProgramada: 0,
            contadorTriage: 0,
        };
    },
    computed: {
        opciones() {
            return [
                {
                    titulo: "Agenda Médica Personal",
                    icono: "mdi-calendar-account",
                    componente: "AtencionMedica",
                    contador: this.contadorConsultasIndividuales,
                    accion: this.contadorConsultas,
                },
                {
                    titulo: "Atenciones No Programadas",
                    icono: "mdi-calendar-remove",
                    componente: "NoProgramadas",
                    contador: this.contadorNoProgramada,
                    accion: this.contadorConsultasNoProgramadas,
                    visible: this.$can("panelmedico.atenciones.noProgramadas"),
                },
                {
                    titulo: "Actividades Grupales",
                    icono: "mdi-account-group",
                    componente: "grupalesComponente",
                    contador: null,
                    accion: () => (this.comp = "grupalesComponente"),
                },
                {
                    titulo: "Atenciones Ocupacionales",
                    icono: "mdi-account-hard-hat",
                    componente: "OcupacionalComponent",
                    contador: this.contadorOcupacional,
                    accion: this.contadorConsultasOcupacionales,
                },
                {
                    titulo: "Evaluaciones de Triage",
                    icono: "mdi-hospital-box-outline",
                    componente: "triageComponent",
                    contador: this.contadorTriage,
                    accion: this.contadorConsultasTriage,
                },
            ].filter((item) => item.visible !== false);
        },
    },
    methods: {
        contadorConsultas() {
            this.$axios
                .get("/consultas/contadorConsultas")
                .then((res) => {
                    this.contadorConsultasIndividuales = res.data;
                })
                .catch((error) => {
                    console.error("Error cargando contadorConsultas:", error);
                });
            this.comp = "AtencionMedica";
        },
        contadorConsultasOcupacionales() {
            this.$axios
                .get("/consultas/contadorConsultaOcupaciona")
                .then((res) => {
                    this.contadorOcupacional = res.data;
                })
                .catch((error) => {
                    console.error("Error cargando contadorOcupacional", error);
                });
            this.comp = "OcupacionalComponent";
        },
        contadorConsultasNoProgramadas() {
            this.$axios
                .get("/consultas/contadorConsultaNoProgramada")
                .then((res) => {
                    this.contadorNoProgramada = res.data;
                })
                .catch((error) => {
                    console.error("Error cargando contadorNoProgramada", error);
                });
            this.comp = "NoProgramadas";
        },
        contadorConsultasTriage() {
            this.$axios
                .post("/admisiones/listarAdmisionesUrgencias")
                .then((res) => {
                    this.contadorTriage = res.data.length;
                })
                .catch((error) => {
                    console.error("Error cargando contadorTriage", error);
                });
            this.comp = "triageComponent";
        },
    },
};
</script>

<style scoped>
.card-panel {
    min-height: 120px;
    transition: all 0.3s ease;
    border-radius: 12px;
    cursor: pointer;
    padding: 8px;
}

.card-panel:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
</style>
