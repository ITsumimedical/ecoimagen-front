<template>
    <v-data-table :headers="headers" :items="contratos" hide-default-footer dense :loading="loading"
        :disabled="loading">

        <template v-slot:top>
            <v-alert text dense border="left" type="info" icon="mdi-file-document-outline">
                Contratos - <strong></strong>
            </v-alert>
        </template>

        <template v-slot:[`item.PGP`]="{ item }">
            <v-chip small dark :color="item.PGP ? 'success' : 'error'">
                {{ item.PGP ? "Sí" : "No" }}</v-chip>
        </template>

        <template v-slot:[`item.capitado`]="{ item }">
            <v-chip small dark :color="item.capitado ? 'success' : 'error'">
                {{ item.capitado ? "Sí" : "No" }}
            </v-chip>
        </template>

        <template v-slot:[`item.fecha_termina`]="{ item }">
            {{ $moment(item.fecha_termina).format('DD/MM/YYYY') }}
        </template>

        <template v-slot:[`item.fecha_inicio`]="{ item }">
            {{ $moment(item.fecha_inicio).format('DD/MM/YYYY') }}
        </template>

        <template v-slot:[`item.evento`]="{ item }">
            <v-chip small dark :color="item.evento ? 'success' : 'error'">
                {{ item.evento ? "Sí" : "No" }}
            </v-chip>
        </template>

        <template v-slot:[`item.activo`]="{ item }">
            <v-chip small dark :color="item.activo ? 'success' : 'error'">
                {{ item.activo ? "Activo" : "Inactivo" }}
            </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">

            <div class="d-flex">

                <v-tooltip top v-if="$can('contrato.actualizar')">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" @click="abrirModalContrato(item)">
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar</span>
                </v-tooltip>

                <v-tooltip top v-if="$can('cups.guardar')">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-if="item.activo" v-bind="attrs" v-on="on"
                            @click="abrirModalTarifas(item)">
                            mdi-clipboard-text
                        </v-icon>
                    </template>
                    <span>Crear tarifa</span>
                </v-tooltip>

                <v-tooltip top v-if="$can('contrato.eliminar')">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" @click="eliminarContrato(item)">
                            mdi-delete
                        </v-icon>
                    </template>
                    <span>Eliminar</span>
                </v-tooltip>

            </div>

        </template>

    </v-data-table>
</template>
<script>
export default {

    props: {
        prestador_id: {
            type: Number,
            required: false,
        }
    },

    data() {
        return {
            loading: false,
            contratos: [],
            headers: [
                { text: 'Entidad', value: 'entidad.nombre' },
                { text: 'Ambito', value: 'ambito.nombre' },
                { text: 'Fecha inicio', value: 'fecha_inicio' },
                { text: 'Fecha finalizaion', value: 'fecha_termina' },
                { text: 'PGP', value: 'PGP' },
                { text: 'Capitado', value: 'capitado' },
                { text: 'Evento', value: 'evento' },
                { text: 'Estado', value: 'activo' },
                { text: 'Acciones', value: 'actions', sortable: false, align: 'center' },
            ],
        }
    },

    watch: {
        prestador_id(val) {
            if (val) {
                this.getContratos();
            }
        }
    },

    methods: {

        /**
         * obtiene los contratos por el prestador
         */
        async getContratos() {
            try {
                this.loading = true
                const { data } = await this.$axios.get('/contrato/listar-por-prestador/' + this.prestador_id)
                this.contratos = data;
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        }

    }
}
</script>