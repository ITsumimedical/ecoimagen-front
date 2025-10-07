<template>
    <v-col>
        <v-tabs centered>
            <v-tab v-if="$can('oncologia.tipo.cancer')">
                <v-icon left>
                    mdi-radioactive
                </v-icon>
                Tipos de cáncer
            </v-tab>

            <v-tab v-if="$can('oncologia.relacionar.diagnosticos')">
                <v-icon left>
                    mdi-atom
                </v-icon>
                Relacionar Diagnósticos
            </v-tab>

            <v-tab v-if="$can('oncologia.relacionar.diagnosticos')">
                <v-icon left>
                    mdi-clipboard-pulse-outline
                </v-icon>
                Registrar Biopsias
            </v-tab>


            <v-tab v-if="$can('oncologia.relacionar.diagnosticos')">
                <v-icon left>
                    mdi-file-document-refresh-outline
                </v-icon>
                Historico Biopsias
            </v-tab>

            <v-tab-item>
                <v-card flat>
                    <tipoCancer />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <relacionarDiagnosticosCancer />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <RegistroBiopsia />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                    <historicoBiopsias />
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-col>
</template>

<script>
import tipoCancer from "@/components/OncologiaParametrizacion/TiposCancer.vue";
import relacionarDiagnosticosCancer from "~/components/OncologiaParametrizacion/relacionarDiagnosticosCancer.vue";
import RegistroBiopsia from "@/components/OncologiaParametrizacion/RegistroBiopsiaComponente.vue";
import historicoBiopsias from '@/components/OncologiaParametrizacion/HistoricoBiopsiasAfiliado.vue'
export default {
    components: {
        tipoCancer,
        relacionarDiagnosticosCancer,
        RegistroBiopsia,
        historicoBiopsias
    },
    data() {
        return {

        }
    }
}

</script>
