<template>
    <v-card elevation="0">
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="12" md="12" class="d-flex justify-end">
                    <v-btn small dark color="success" @click="abrirModal('crear')">
                        CREAR
                        <v-icon right>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row dense class="mt-4">
                <v-col cols="12" md="12" sm="12">
                    <v-data-table disable-pagination hide-default-footer loading-text="Cargando... Por favor espere"
                        :headers="headers" :items="areaResponsables" :loading="loading"
                        no-data-text="Sin datos para mostrar" dense>
                        <template v-slot:item.estado="{ item }">
                            <v-chip label dark small :color="item?.estado_id == 1 ? 'green' : 'red'">
                                <b>{{ item?.estado_id == 1 ? 'ACTIVO' : 'INACTIVO' }}</b>
                            </v-chip>
                        </template>
                        <template v-slot:[`item.responsables`]="{ item }">
                            <ResponsablesAreaComponente :item="item"></ResponsablesAreaComponente>
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="warning" small v-bind="attrs" v-on="on"
                                        @click="abrirModal('editar', item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Editar</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon small
                                        :color="item.estado_id == 1 ? 'success' : item.estado_id == 2 ? 'error' : 'error'"
                                        v-bind="attrs" v-on="on" @click="cambiarEstado(item)">
                                        {{ item.estado_id == 1 ? 'mdi-toggle-switch-off' : item.estado_id == 2 ?
                                            'mdi-toggle-switch' : 'mdi-toggle-switch-off' }}
                                    </v-icon>
                                </template>
                                <span>Cambiar estado</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                    <v-row no-gutters>
                        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                            <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                @input="listarAreaResponsables">
                            </v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="listarAreaResponsables">
                            </v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <ModalAreaResponsable :mostrarModal.sync="mostrarModal" :modo="modo" :areaResponsable="areaResponsable"
            @listar="listarAreaResponsables"></ModalAreaResponsable>
    </v-card>
</template>
<script>
import { mapActions } from 'vuex';
import ModalAreaResponsable from './modalAreaResponsable.vue';
import ResponsablesAreaComponente from '../barreraAccesoComponentes/responsablesAreaComponente.vue';


export default {
    components: {
        ModalAreaResponsable,
        ResponsablesAreaComponente
    },

    data() {
        return {
            areaResponsables: [],
            areaResponsable: null,
            loading: false,
            modo: null, // 'crear' | 'editar'
            mostrarModal: false,
            pagina: 1,
            total: 0,
            opcionActual: 10,
            opciones: [5, 10, 20, 50, 100],
            headers: [
                {
                    text: "N°",
                    value: "id",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Nombre",
                    value: "nombre",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Responsables",
                    value: "responsables",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Estado",
                    value: "estado",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Acciones",
                    value: "acciones",
                    align: 'center',
                    sortable: false,
                },
            ]
        }
    },

    mounted() {
        this.listarAreaResponsables();
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        listarAreaResponsables() {
            this.loading = true;
            this.$axios.post(
                "/area-responsable-barrera-acceso/listar-area-responsables?page=" + this.pagina + "&cant=" + this.opcionActual
            )
                .then((res) => {
                    this.areaResponsables = res.data.data;
                    this.total = res.data.last_page;
                })
                .catch((e) => {
                    this.$toast.error("Error al listar los responsables");
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        async cambiarEstado(item) {
            try {
                const response = await this.$swal({
                    title: "Desea cambiar el estado?",
                    text: "Al aceptar este mensaje, se cambiara el estado del area responsable.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Aceptar",
                })
                if (response.value) {
                    this.setPreload(true);
                    await this.$axios.put(`/area-responsable-barrera-acceso/cambiar_estado-area-responsable/${item.id}`)
                    await this.listarAreaResponsables();
                }
            } catch (error) {
                this.$toast.error("Error al cambiar el estado");
            } finally {
                this.setPreload(false)
            }
        },

        abrirModal(modo, item = null) {
            this.modo = modo;
            this.areaResponsable = item;
            this.mostrarModal = true;
        },
    }
}
</script>
