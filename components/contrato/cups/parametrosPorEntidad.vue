<template>
    <div>
        <v-row dense v-if="cup">
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" icon="mdi-form-select" border="left">
                    <b>Parámetros por Entidad</b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table dense :loading="loading.entidadesCup" :items="entidadesCup" :headers="headersEntidades">
                    <template v-slot:[`item.diagnostico_requerido`]="{ item }">
                        <v-chip :color="item.diagnostico_requerido === true ? 'success' : 'error'" dark small>{{
                            item.diagnostico_requerido === true ? 'SI' : 'NO' }}</v-chip>
                    </template>
                    <template v-slot:[`item.requiere_auditoria`]="{ item }">
                        <v-chip :color="item.requiere_auditoria === true ? 'success' : 'error'" dark small>{{
                            item.requiere_auditoria === true ? 'SI' : 'NO' }}</v-chip>
                    </template>
                    <template v-slot:[`item.periodicidad`]="{ item }">
                        <td>{{ item.periodicidad }} Días</td>
                    </template>
                    <template v-slot:[`item.copago`]="{ item }">
                        <v-chip :color="item.copago === true ? 'success' : 'error'" dark small>{{
                            item.copago === true ? 'SI' : 'NO' }}</v-chip>
                    </template>
                    <template v-slot:[`item.moderadora`]="{ item }">
                        <v-chip :color="item.moderadora === true ? 'success' : 'error'" dark small>{{
                            item.moderadora === true ? 'SI' : 'NO' }}</v-chip>
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-on="on" v-bind="attrs" @click="abrirModalEditarEntidadCup(item)">
                                    <v-icon color="warning">mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- Editar Entidad Cup -->
        <modal-editar-entidad-cup :cup-entidad-seleccionado="cupEntidadSeleccionado"
            :mostrar-modal-editar-entidad-cup.sync="mostrarModalEditarEntidadCup" @recargarDatos="listarEntidadesCup" />

    </div>
</template>
<script>
import modalEditarEntidadCup from '@/components/contrato/cups/modalEditarEntidadCup.vue';
export default {
    components: { modalEditarEntidadCup },
    props: {
        cup: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            loading: {
                entidadesCup: false
            },
            entidadesCup: [],
            headersEntidades: [
                { text: 'N°', value: 'id', align: 'center' },
                { text: 'Entidad', value: 'entidad.nombre', align: 'center' },
                { text: 'Diagnóstico Requerido', value: 'diagnostico_requerido', align: 'center' },
                { text: 'Nivel de Ordenamiento', value: 'nivel_ordenamiento', align: 'center' },
                { text: 'Nivel de Portabilidad', value: 'nivel_portabilidad', align: 'center' },
                { text: 'Requiere Auditoria', value: 'requiere_auditoria', align: 'center' },
                { text: 'Periodicidad', value: 'periodicidad', align: 'center' },
                { text: 'Cantidad Máxima de Ordenamiento', value: 'cantidad_max_ordenamiento', align: 'center' },
                { text: 'Copago', value: 'copago', align: 'center' },
                { text: 'Moderadora', value: 'moderadora', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ],
            cupEntidadSeleccionado: {},
            mostrarModalEditarEntidadCup: false
        };
    },
    watch: {
        cup(newValue) {
            if (newValue && newValue.id) {
                this.listarEntidadesCup();
            }
        }
    },
    methods: {
        async listarEntidadesCup() {
            try {
                this.loading.entidadesCup = true;
                const response = await this.$axios.get(`/cup/listar-cup-entidad-por-cup/${this.cup.id}`);
                this.entidadesCup = response.data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las entidades asociadas al CUP');
            } finally {
                this.loading.entidadesCup = false;
            }
        },

        abrirModalEditarEntidadCup(entidadCup) {
            this.cupEntidadSeleccionado = entidadCup;
            this.mostrarModalEditarEntidadCup = true;
        }
    }
}
</script>