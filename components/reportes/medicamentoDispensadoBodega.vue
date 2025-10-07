<template>
    <v-row dense>
        <v-col cols="12" sm="6" md="6">
            <v-text-field v-model="params.fechaInicial" label="Fecha Inicial" outlined dense type="date"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-text-field v-model="params.fechaFinal" label="Fecha Final" outlined dense type="date"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-autocomplete v-model="params.bodega_id" label="Bodega" dense outlined :items="bodegas" item-value="id" item-text="nombre"></v-autocomplete>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            params: {
                fechaInicial: null,
                fechaFinal: null,
                bodega_id: null,
            },
            bodegas: []
        };
    },
    watch: {
        params: {
            handler(newVal) {
                this.$emit("update-params", newVal);
            },
            deep: true,
        },
    },

    mounted(){
        this.getBodegas()
    },

    methods: {

        async getBodegas(){
            try {
                const {data} = await this.$axios.get('/bodegas/listar-por-estado');
                this.bodegas = data;
            } catch (error) {
                this.$toast.error('Error al cargar las bodegas')
            }
        }

    }
};
</script>