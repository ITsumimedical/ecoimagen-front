<template>
    <v-col>
        <v-tabs centered>
            <v-tab>
                <v-icon left>
                    mdi-book-check-outline
                </v-icon>
                Tipos de Historias Clinicas
            </v-tab>
            <v-tab>
                <v-icon left>
                    mdi-book-check-outline
                </v-icon>
                Componentes tipos de historia
            </v-tab>
            <v-tab>
                <v-icon left>
                    mdi-book-check-outline
                </v-icon>
                Parametrización tipos de historias
            </v-tab>
            <v-tab-item>
                <v-card flat>
                    <crearTipoHistoria />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <crearComponenteHistoria />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <parametrizacionTipoHistoria />
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-col>
</template>

<script>
    import parametrizacionTipoHistoria from "@/components/panelMedico/parametrizacionTipoHistoriasClinicas/crearParametrizacionTipoHistoriaComponente.vue";
    import crearComponenteHistoria from "@/components/panelMedico/parametrizacionTipoHistoriasClinicas/crearNuevoComponenteHistoria.vue";
    import crearTipoHistoria from "@/components/panelMedico/parametrizacionTipoHistoriasClinicas/crearTipoHistoriaClinica.vue"
    export default {
        components: {
            parametrizacionTipoHistoria,
            crearComponenteHistoria,
            crearTipoHistoria,
        },
        data() {
            return {

            }
        }
    }

</script>
