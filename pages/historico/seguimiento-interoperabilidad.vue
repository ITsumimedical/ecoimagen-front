<template>
    <v-card>

        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Interoperabilidad - LOGS</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>

        <v-card-text>
            <v-row dense>
                <v-col cols="12" sm="12" md="12">
                    <v-tabs v-model="tab" grow show-arrows @change="cambiarTab">
                        <v-tabs-slider color="primary" />
                        <v-tab key="salientes">
                            <span>Salientes</span>
                        </v-tab>
                        <v-tab key="entrantes">
                            <span>Entrantes</span>
                        </v-tab>
                        <v-tabs-items v-model="tab">
                            <v-tab-item key="salientes">
                                <ListarSeguimientoInteroperabilidadComponent ref="salientes" />
                            </v-tab-item>
                            <v-tab-item key="entrantes">
                                <ListarSeguimientoInteroperabilidadEntrates ref="entrantes" />
                            </v-tab-item>
                        </v-tabs-items>
                    </v-tabs>
                </v-col>
            </v-row>

        </v-card-text>

    </v-card>
</template>
<script>
import ListarSeguimientoInteroperabilidadComponent from "@/components/historico/ListarSeguimientoInteroperabilidadComponent";
import ListarSeguimientoInteroperabilidadEntrates from "@/components/historico/listarSeguimientoInteroperabilidadEntrates.vue";

export default {

    components: {
        ListarSeguimientoInteroperabilidadComponent,
        ListarSeguimientoInteroperabilidadEntrates
    },
    data() {
        return {
            tab: 'salientes',
        }
    },
    methods: {
        cambiarTab(tab) {
            switch (tab) {
                case 0:
                    if (this.$refs.salientes) {
                        this.$refs.salientes.listarLogs()
                    }
                    break;
                case 1:
                    if (this.$refs.entrantes) {
                        this.$refs.entrantes.listarRegistrosInteroperabilidadEntrantes()
                    }
                    break;
            }
        }
    }

}

</script>