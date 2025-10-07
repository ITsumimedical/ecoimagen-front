<template>
    <div>
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="primary" class="text-center" border="left" icon="mdi-account-clock-outline">
                    <b>Evoluciones</b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12" align="right">
                <v-btn small dark color="success" @click="abrirModalAgregarEvolucion">
                    Agregar Evolución
                    <v-icon small right>mdi-plus-circle-outline</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-divider />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table dense :items="evolucionesAdmision" :headers="headersEvolucionesAdmision"
                    :loading="loading.evolucionesAdmision" loading-text="Cargando... Por favor espere."
                    no-data-text="Sin datos para mostrar.">
                    <template v-slot:[`item.registrado_por_operador`]="{ item }">
                        {{
                            [item.create_by?.operador?.nombre, item.create_by?.operador?.apellido]
                                .filter(Boolean)
                        .join(' ')
                        }}
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="warning" v-on="on" v-bind="attrs"
                                    @click="abrirModalEditarEvolucion(item)">
                                    mdi-pencil
                                </v-icon>
                            </template>
                            Editar Evolución
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- Agregar Nueva Evolución -->
        <modal-agregar-evolucion-admision :mostrar-modal-agregar.sync="mostrarModalAgregar"
            :datos-admision="datos.admision_urgencia" @recargarDatos="listarEvolucionesAdmision" />

        <!-- Editar Evolución -->
        <modal-editar-evolucion-admision :mostrar-modal-editar.sync="mostrarModalEditar"
            :evolucion-seleccionada="evolucionSeleccionada" @recargarDatos="listarEvolucionesAdmision" />
    </div>
</template>
<script>
import ModalAgregarEvolucionAdmision from '@/components/admisiones/evoluciones/modalAgregarEvolucionAdmision.vue';
import ModalEditarEvolucionAdmision from '@/components/admisiones/evoluciones/modalEditarEvolucionAdmision.vue';

export default {
    components: {
        ModalAgregarEvolucionAdmision,
        ModalEditarEvolucionAdmision
    },
    props: {
        datos: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            loading: {
                evolucionesAdmision: false
            },
            evolucionesAdmision: [],
            headersEvolucionesAdmision: [
                { text: 'N°', value: 'id', align: 'center' },
                { text: 'Descripción Física', value: 'descripcion_fisica', align: 'center' },
                { text: 'Tratamiento', value: 'tratamiento', align: 'center' },
                { text: 'Peso (Kg)', value: 'peso', align: 'center' },
                { text: 'Tension Arterial', value: 'tension_arterial', align: 'center' },
                { text: 'Frecuencia Respiratoria', value: 'frecuencia_respiratoria', align: 'center' },
                { text: 'Frecuencia Cardíaca', value: 'frecuencia_cardiaca', align: 'center' },
                { text: 'Temperatura', value: 'temperatura', align: 'center' },
                {text: 'Registrado Por',value: 'registrado_por_operador',align: 'center',},
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ],
            mostrarModalAgregar: false,
            mostrarModalEditar: false,
            evolucionSeleccionada: {}
        }
    },
    methods: {
        async listarEvolucionesAdmision() {
            try {
                this.loading.evolucionesAdmision = true;

                const { data } = await this.$axios.get(`/evoluciones/listar-evoluciones-admision/${this.datos?.admision_urgencia_id}`);

                this.evolucionesAdmision = data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las evoluciones');
            } finally {
                this.loading.evolucionesAdmision = false;
            }
        },

        abrirModalAgregarEvolucion() {
            this.mostrarModalAgregar = true
        },

        abrirModalEditarEvolucion(evolucion) {
            this.evolucionSeleccionada = evolucion;
            this.mostrarModalEditar = true;
        }
    },
}
</script>
