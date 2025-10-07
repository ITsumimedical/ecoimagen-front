<template>
    <v-card>
        <v-tabs centered next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows>
            <v-tab v-for="(componente,index) in componentes" :key="index">
                {{index}}
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
import CupPrestadores from '~/components/prestadores/CupPrestadores.vue';

export default {
    name: 'parametrizacionCupPrestadores',
    components: {
        CupPrestadores
    },
    data() {
        return {
            componentes:{
                'Parametrizacion Cups Prestadores':'CupPrestadores',
            }
        };
    },

    mounted() {

    },

    methods: {

    },
};
</script>

<style lang="scss" scoped>

</style>
