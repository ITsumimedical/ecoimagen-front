<template>
    <v-row dense v-if="cup">
        <v-col cols="12" sm="12" md="12">
            <v-alert dense text color="blue-grey" icon="mdi-file-document-multiple-outline" border="left">
                <b>Familias</b>
            </v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <template v-if="familiasCup.length > 0">
                <v-virtual-scroll :items="familiasCup" :item-height="80" :height="250">
                    <template v-slot:default="{ item }">
                        <v-list-item>
                            <v-list-item-content>
                                <v-alert dense text color="gray" icon="mdi-information-box-outline" border="left"
                                    style="height: 70px;">
                                    el CUP <strong>{{ cup.codigo }} - {{ cup.nombre }}</strong> se encuentra en la
                                    familia <strong>{{ item.nombre }}</strong>
                                </v-alert>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-virtual-scroll>
            </template>
            <template v-else>
                <v-alert dense text color="error" icon="mdi-alert" border="left" style="height: 70px;">
                    <b>No hay familias asociadas a este CUP.</b>
                </v-alert>
            </template>
        </v-col>
    </v-row>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    props: {
        cup: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            familiasCup: []
        };
    },
    watch: {
        cup(newValue) {
            if (newValue && newValue.id) {
                this.listarFamiliasCup();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async listarFamiliasCup() {
            try {
                this.setPreload(true);

                const response = await this.$axios.get(`/cup/listar-familias-cup/${this.cup.id}`);

                this.familiasCup = response.data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las familias del CUP.')
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>