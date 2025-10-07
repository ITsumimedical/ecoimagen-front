<template>
    <v-card>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Indicadores</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
        </v-card>
        <v-tabs centered next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows grow>
            <v-tab v-for="(componente, index) in componentes" :key="index">
                {{ index }}
            </v-tab>
            <v-tab-item v-for="(componente) in componentes" :key="componente">
                <v-card flat>
                    <component :is="componente"></component>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>

<script>
import IndicadoresOncologicosFomag from '~/components/indicadores/indicadoresOncologicosFomag.vue';

export default {
    name: 'IndicadoresServicios',
    components: {
        IndicadoresOncologicosFomag
    },
    data() {
        return {
            componentes: {
                'Indicadores Oncologicos FOMAG': 'IndicadoresOncologicosFomag',
            }
        };
    },

    mounted() {

    },

    methods: {

    },
};
</script>

<style lang="scss" scoped></style>
