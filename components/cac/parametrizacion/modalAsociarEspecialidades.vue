<template>
    <v-dialog v-model="mostrarModalAsociarEspecialidades" persistent max-width="900px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Cuentas de Alto Costo - Asociar Especialidades</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-chip dark label color="primary">
                        <b>{{ patologia?.nombre?.toUpperCase() }}</b>
                    </v-chip>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formAgregarEspecialidad">
                    <v-row dense>
                        <v-col cols="12" md="10" sm="12">
                            <v-autocomplete dense outlined label="Seleccionar Especialidades"
                                :items="especialidades.opciones" item-text="nombre" item-value="id"
                                :loading="especialidades.loading.opciones" multiple chip small-chips deletable-chips
                                clearable v-model="especialidades.agregar" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" md="2" sm="12">
                            <v-btn dark block color="primary" @click="agregarEspecialidades()"
                                :loading="especialidades.loading.patologia">
                                Agregar
                                <v-icon right>mdi-plus-circle-outline</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table dense :items="especialidades.patologia" :headers="especialidades.headers"
                            show-select item-key="id" v-model="especialidades.eliminar"
                            :loading="especialidades.loading.patologia" loading-text="Cargando... Por favor espere."
                            no-data-text="Sin datos para mostrar"></v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn small dark color="warning" @click="removerEspecialidades()"
                    :disabled="especialidades.eliminar.length === 0" :loading="especialidades.loading.patologia">
                    Remover Especialidades ({{ especialidades.eliminar.length }})
                </v-btn>
                <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    props: {
        patologia: {
            type: Object,
            default: () => ({})
        },
        mostrarModalAsociarEspecialidades: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            especialidades: {
                loading: {
                    opciones: false,
                    patologia: false
                },
                opciones: [],
                patologia: [],
                agregar: [],
                eliminar: [],
                headers: [
                    {
                        text: 'Especialidad', value: 'nombre', align: 'center', sortable: false,
                    },
                ],
            },
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.',
            }
        }
    },
    watch: {
        mostrarModalAsociarEspecialidades(nuevoValor) {
            if (nuevoValor) {
                this.listarEspecialidadesPatologia();
                this.listarOpcionesEspecialidades();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.especialidades.patologia = [];
            this.$refs.formAgregarEspecialidad.reset();
            this.$emit('update:mostrarModalAsociarEspecialidades', false)
        },

        async listarEspecialidadesPatologia() {
            this.especialidades.loading.patologia = true;
            try {

                const { data } = await this.$axios.get(`/cac/listar-especialidades-patologia/${this.patologia.id}`);

                this.especialidades.patologia = data;

            } catch (error) {
                this.$toast.error('Error al listar las especialidades');
            } finally {
                this.especialidades.loading.patologia = false;
            }
        },

        async listarOpcionesEspecialidades() {
            this.especialidades.loading.opciones = true;
            try {

                const { data } = await this.$axios.get(`/especialidades`);

                this.especialidades.opciones = data;

            } catch (error) {
                this.$toast.error('Error al listar las especialidades');
            } finally {
                this.especialidades.loading.opciones = false;
            }
        },



        async agregarEspecialidades() {

            if (!this.$refs.formAgregarEspecialidad.validate()) return;

            const payload = {
                patologia_id: this.patologia.id,
                especialidades: this.especialidades.agregar
            }

            this.setPreload(true);

            try {
                await this.$axios.post('/cac/asociar-especialidades-patologia', payload)

                this.especialidades.agregar = [];

                this.$toast.success('Especialidades asociadas correctamente');

                await this.listarEspecialidadesPatologia();

            } catch (error) {
                this.$toast.error('Error al asociar especialidades');
            } finally {
                this.setPreload(false);
            }
        },

        async removerEspecialidades() {
            const payload = {
                patologia_id: this.patologia.id,
                especialidades: this.especialidades.eliminar.map(especialidad => especialidad.id)
            }

            this.setPreload(true);

            try {
                await this.$axios.post('/cac/remover-especialidades-patologia', payload);

                this.especialidades.eliminar = [];

                this.$toast.success('Especialidades removidas correctamente');

                await this.listarEspecialidadesPatologia();

            } catch (error) {
                this.$toast.error('Error al asociar especialidades');
            } finally {
                this.setPreload(false);

            }
        }
    }
}
</script>