<template>
    <v-dialog v-model="mostrarModalGestionarGrupos" scrollable persistent max-width="1200px"
        transition="dialog-transition">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Gestionar Grupos</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <span>{{ especialidadSeleccionada?.nombre }}</span>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formAgregarGrupos">
                    <v-row dense class="mt-4">
                        <v-col cols="12" sm="12" md="10">
                            <v-autocomplete :items="opcionesGrupos" multiple chips small-chips clearable deletable-chips
                                item-text="nombre" item-value="id" v-model="gruposSeleccionados"
                                :rules="[rules.minGrupos]" :loading="loading.opcionesGrupos" dense outlined
                                label="Grupos" />
                        </v-col>
                        <v-col cols="12" sm="12" md="2">
                            <v-btn block dark color="primary" @click="agregarGrupos()"
                                :loading="loading.gruposEspecialidad">
                                Agregar
                                <v-icon right>mdi-plus-circle-outline</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table dense :loading="loading.gruposEspecialidad" :headers="headersGruposEspecialidad"
                            no-data-text="No hay datos para mostrar." loading-text="Cargando... Por favor espere."
                            v-model="gruposSeleccionadosEliminar" show-select :single-select="false" item-key="id"
                            :items="gruposEspecialidad"></v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
                <v-btn small dark color="warning" :disabled="gruposSeleccionadosEliminar.length === 0"
                    @click="eliminarGrupos">Eliminar Grupos Seleccionados ({{
                        gruposSeleccionadosEliminar.length }})</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    props: {
        mostrarModalGestionarGrupos: {
            type: Boolean,
            default: false
        },
        especialidadSeleccionada: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            loading: {
                opcionesGrupos: false,
                gruposEspecialidad: false
            },
            rules: {
                minGrupos: v => v.length >= 1 || 'Debe seleccionar al menos un grupo',
            },
            gruposSeleccionados: [],
            opcionesGrupos: [],
            gruposEspecialidad: [],
            headersGruposEspecialidad: [
                {
                    text: 'N°',
                    value: 'id',
                    align: 'center'
                },
                {
                    text: 'Grupo',
                    value: 'nombre',
                    align: 'center'
                },
            ],
            gruposSeleccionadosEliminar: []
        }
    },
    watch: {
        mostrarModalGestionarGrupos(nuevoValor) {
            if (nuevoValor) {
                this.listarGruposEspecialidad();
                this.listarOpcionesGrupos();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.$refs.formAgregarGrupos.reset();
            this.gruposEspecialidad = [];
            this.gruposSeleccionadosEliminar = [];
            this.$emit("update:mostrarModalGestionarGrupos", false)
        },

        async listarOpcionesGrupos() {
            try {
                this.loading.opcionesGrupos = true
                const { data } = await this.$axios.get('/grupos/listar')
                this.opcionesGrupos = data
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los grupos')
            } finally {
                this.loading.opcionesGrupos = false
            }
        },

        async listarGruposEspecialidad() {
            try {
                this.loading.gruposEspecialidad = true;
                const { data } = await this.$axios.get(`/especialidades/listar-grupos-especialidad/${this.especialidadSeleccionada?.id}`);
                this.gruposEspecialidad = data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los grupos de la especialidad');
            } finally {
                this.loading.gruposEspecialidad = false;
            }
        },

        async agregarGrupos() {
            if (!this.$refs.formAgregarGrupos.validate()) return;
            this.setPreload(true);
            try {

                await this.$axios.post('/especialidades/agregar-grupos', {
                    especialidad_id: this.especialidadSeleccionada.id,
                    grupos: this.gruposSeleccionados
                })
                this.$toast.success('Grupos agregados correctamente')
                this.$refs.formAgregarGrupos.reset();

                await this.listarGruposEspecialidad();

            } catch (error) {
                this.$toast.error('Ocurrió un error al agregar los grupos')
            } finally {
                this.setPreload(false)
            }
        },

        async eliminarGrupos() {
            if (this.gruposSeleccionadosEliminar.length === 0) {
                this.$toast.error('Debe seleccionar al menos un grupo')
                return
            }
            try {
                this.setPreload(true);
                const idsGrupos = this.gruposSeleccionadosEliminar.map(grupo => grupo.id)

                await this.$axios.post('/especialidades/eliminar-grupos', {
                    especialidad_id: this.especialidadSeleccionada.id,
                    grupos: idsGrupos
                })
                this.$toast.success('Grupos eliminados correctamente')
                this.gruposSeleccionadosEliminar = [];
                await this.listarGruposEspecialidad();

            } catch (error) {
                this.$toast.error('Ocurrió un error al eliminar los grupos')
            } finally {
                this.setPreload(false)
            }
        }
    }
}
</script>