<template>
    <v-data-table :headers="headers" :items="facturas" :search="search" @update:options="fetchFacturas">

        <template v-slot:top>
            <v-text-field ref="" v-model="search" label="Buscar ..." class="mx-4" dense outlined></v-text-field>
        </template>

        <template v-slot:item.emitida="{ item }">
            <v-chip :color="item.emitida ? 'green' : 'red'" dark>
                {{ item.emitida ? 'Emitida' : 'No Emitida' }}
            </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-btn :to="`/facturacion/factura/${item.unique}`" color="primary" text>
                Ver
            </v-btn>
        </template>

        <template v-slot:item.total="{ item }">
            {{ $formatPesos(item.total) }}
        </template>

        <template v-slot:item.fecha="{ item }">
            {{ $moment(item.fecha).format('Y-MM-D') }}
        </template>

    </v-data-table>
</template>
<script>
export default {
    name: "ListarFacturasComponent",
    data() {
        return {
            facturas: [],
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Numero', value: 'numero' },
                { text: 'Total', value: 'total' },
                { text: 'Fecha', value: 'fecha' },
                { text: 'Estado', value: 'emitida' },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            search: null
        }
    },

    methods: {
        async fetchFacturas() {
            try {
                const response = await this.$axios.get('/facturacion/listar');
                this.facturas = response.data;
            } catch (error) {
                console.error("Error fetching facturas:", error);
            }
        }
    },
}
</script>