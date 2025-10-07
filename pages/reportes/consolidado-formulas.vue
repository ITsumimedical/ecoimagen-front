<template>
    <v-card class="mx-auto" :disabled="loading" :loading="loading">
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Consolidado de Fórmulas</span>
                    </div>
                </v-toolbar-title>
            </v-toolbar>
        </v-card-title>

        <v-card-text>
            <FormConsolidadoFormulasComponent @loading="setLoading" />
        </v-card-text>

    </v-card>
</template>
<script>
import FormConsolidadoFormulasComponent from '~/components/reportes/historico/FormConsolidadoFormulasComponent.vue';
export default {
    components: {
        FormConsolidadoFormulasComponent
    },

    head() {
        return {
            title: 'Consolidado de Fórmulas',
            meta: [
                { name: 'description', content: 'Consolidado de Fórmulas' },
                { name: 'keywords', content: 'consolidado, formulas, reportes' }
            ]
        };
    },

    data() {
        return {
            loading: false
        };
    },

    methods: {
        setLoading(value) {
            this.loading = value;
        }
    },
}

</script>