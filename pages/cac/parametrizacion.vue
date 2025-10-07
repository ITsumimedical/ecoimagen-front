<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Cuentas de Alto Costo - Parametrización</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12" align="right">
                        <v-btn color="success" small dark @click="abrirModalCrear">
                            Añadir
                            <v-icon small right>mdi-plus-circle-outline</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table dense :headers="patologias.headers" :items="patologias.data"
                            :loading="patologias.loading" no-data-text="Sin datos para mostrar."
                            loading-text="Cargando... Por favor espere.">
                            <template v-slot:[`item.activo`]="{ item }">
                                <v-chip small dark label :color="item.activo ? 'success' : 'error'">
                                    <b>
                                        {{ item.activo ? 'ACTIVO' : 'INACTIVO' }}
                                    </b>
                                </v-chip>
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <div class="d-flex align-center justify-center" style="gap: 0.3rem">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="primary" v-bind="attrs" v-on="on"
                                                @click="abrirModalAsociarEspecialidades(item)">
                                                mdi-star-box-multiple-outline
                                            </v-icon>
                                        </template>
                                        <span>Asociar Especialidades</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon :color="item.activo ? 'error' : 'success'" v-bind="attrs" v-on="on"
                                                @click="cambiarEstadoPatologia(item)">
                                                {{ item.activo ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
                                            </v-icon>
                                        </template>
                                        <span>{{ item.activo ? 'Inactivar' : 'Activar' }}</span>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <modal-crear-patologia-cac :mostrar-modal-crear.sync="mostrarModal.crear" @recargarDatos="listarPatologias" />

        <modal-asociar-especialidades :mostrar-modal-asociar-especialidades.sync="mostrarModal.asociarEspecialidades"
            :patologia="patologias.seleccionada" />

    </div>
</template>

<script>
import { mapActions } from 'vuex';
import ModalCrearPatologiaCac from '~/components/cac/parametrizacion/modalCrearPatologiaCac.vue';
import ModalAsociarEspecialidades from '~/components/cac/parametrizacion/modalAsociarEspecialidades.vue';

export default {
    components: { ModalCrearPatologiaCac, ModalAsociarEspecialidades },
    middleware({ $can, redirect }) {
        if (!$can('cac.parametrizacion')) {
            return redirect('/')
        }
    },
    data() {
        return {
            patologias: {
                loading: false,
                data: [],
                headers: [
                    { text: 'ID', value: 'id', align: 'center' },
                    { text: 'Patología', value: 'nombre', align: 'center' },
                    { text: 'Estado', value: 'activo', align: 'center' },
                    { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
                ],
                seleccionada: {}
            },
            mostrarModal: {
                crear: false,
                asociarEspecialidades: false
            },

        }
    },
    mounted() {
        this.listarPatologias();
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        abrirModalCrear() {
            this.mostrarModal.crear = true;
        },

        abrirModalAsociarEspecialidades(patologia) {
            this.mostrarModal.asociarEspecialidades = true;
            this.patologias.seleccionada = patologia;
        },

        async listarPatologias() {
            try {
                this.patologias.loading = true;

                const { data } = await this.$axios.get('/cac/listar-patologias', {
                    params: {
                        activo: false
                    }
                });

                this.patologias.data = data;

            } catch (error) {
                this.$toast.error('Error al listar las patologias');
            } finally {
                this.patologias.loading = false;
            }
        },

        async cambiarEstadoPatologia(patologia) {
            try {
                const { value } = await this.$swal({
                    title: '¿Está seguro(a)?',
                    text: `¿Desea ${patologia.activo ? 'inactivar' : 'activar'} la patologia ${patologia.nombre}?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#28a745',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar'
                });

                if (value) {
                    this.setPreload(true);

                    await this.$axios.patch(`/cac/cambiar-estado/${patologia.id}`);

                    this.$toast.success(`Patologia actualizada correctamente.`);

                    await this.listarPatologias();
                }

            } catch (error) {
                this.$toast.error('Error al cambiar el estado de la patologia');
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>