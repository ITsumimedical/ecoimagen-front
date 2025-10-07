<template>

    <v-data-table :headers="headers" :items="contratos" hide-default-footer dense>

        <template v-slot:top>
            <v-alert text dense border="left" type="info" icon="mdi-file-document-outline">
                Tarifas <strong></strong>
            </v-alert>

            <v-row>

                <v-col cols="12" md="6">
                    <v-autocomplete dense :items="reps" item-text="nombre" item-value="id" v-model="filtro.rep_id"
                        label="Sedes" outlined :loading="loading" :disabled="loading">
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                    <v-autocomplete dense :items="contratos" item-text="entidad_ambito" item-value="id"
                        v-model="filtro.contrato_id" label="Contrato" outlined>
                    </v-autocomplete>
                </v-col>

            </v-row>

        </template>

    </v-data-table>

</template>
<script>

export default {

    props: {
        prestador_id: {
            type: Number,
            required: false
        }
    },

    data() {
        return {
            reps: [],
            contratos: [],
            tarifas: [],
            loading: false,
            headers: [
                { text: "Tipo manual", value: "manual_tarifario.nombre" },
                { text: "Pleno", value: "pleno" },
                { text: "Tarifa", value: "valor" },
                { text: "Personas", value: "personas" },
                { text: "Estado", value: "activo" },
                { text: "Acciones", value: "acciones", sortable: false, align: 'center' },
            ],
            filtro: {
                rep_id: null,
                contrato_id: null
            }
        }
    },

    watch: {
        async prestador_id(value) {
            if (value) {
                this.loading = true
                await this.getContratos();
                await this.getReps();
                this.loading = false;
            }
        }
    },

    methods: {

        async getContratos() {
            try {
                const { data } = await this.$axios.get('/contrato/listar-por-prestador/' + this.prestador_id)
                this.contratos = data;
            } catch (error) {
                console.log(error)
            }
        },

        async getReps() {
            try {
                const { data } = await this.$axios.get('/reps/listar-por-prestador');
                this.reps = data;
            } catch (error) {
                console.log(error);
            }
        }

    }

}

</script>