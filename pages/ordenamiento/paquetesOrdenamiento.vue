<template>
    <v-card elevation="0">
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title class="d-flex align-center">
                    <img src="/images/ojo.svg" height="50" width="50" />
                    <span class="ml-3">Paquetes de ordenamiento</span>
                </v-toolbar-title>
                <v-spacer />
                <v-btn color="success" small @click="abrirDialogo('create')">
                    Crear paquete
                </v-btn>
            </v-toolbar>
        </v-card-title>

        <v-data-table :headers="headers" :items="paquetes" :loading="loading" class="pa-4"
            loading-text="Cargando paquetes" no-data-text="No hay paquetes aún" dense>
            <template v-slot:[`item.activo`]="{ item }">
                <v-chip label small dark :color="item.activo ? 'green' : 'error'">
                    {{ item.activo ? 'Activo' : 'Inactivo' }}
                </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small color="warning" v-bind="attrs" v-on="on" @click="abrirDialogo('edit', item)">
                            <v-icon small color="orange darken-2">mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>Editar paquete</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small :color="item.activo ? 'error' : 'green'" v-bind="attrs" v-on="on"
                            @click="actualizarEstado(item)">
                            <v-icon :color="item.activo ? 'error' : 'green'">
                                {{ item.activo ? 'mdi-toggle-switch-off-outline' : 'mdi-toggle-switch-outline' }}
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>{{ item.activo ? 'Desactivar paquete' : 'Activar paquete' }}</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small color="primary" v-bind="attrs" v-on="on" @click="abrirParametrizacion(item)">
                            <v-icon small>mdi-cog</v-icon>
                        </v-btn>
                    </template>
                    <span>Parametrizar paquete</span>
                </v-tooltip>

            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="800px" persistent>
            <v-card>
                <v-alert text dense border="left" icon="mdi-toolbox-outline" type="info">
                    {{ modoDialogo === 'create' ? 'Crear Paquete' : 'Editar Paquete' }}
                </v-alert>
                <v-card-text>
                    <v-form ref="form" v-model="formValid">
                        <v-text-field dense outlined v-model="formData.nombre" label="Nombre"
                            :rules="[v => !!v || 'Se requiere nombre']" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="dialog = false" small dark color="error">Cancelar</v-btn>
                    <v-btn color="success" @click="guardarPaquete" small>Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogParametrizacion" max-width="1000px" persistent>
            <v-card>
                <v-card-title>
                    Parametrizar paquete: {{ paqueteSeleccionado?.nombre }}
                </v-card-title>
                <v-card-text>
                    <v-tabs v-model="tab" grow>
                        <v-tab>Servicios (CUPS)</v-tab>
                        <v-tab>Medicamentos</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">

                        <!-- cups -->
                        <v-tab-item>
                            <v-card flat class="mt-4">
                                <v-row align="center">
                                    <v-col cols="12" sm="8">
                                        <v-autocomplete dense outlined clearable v-model="cupSeleccionado"
                                            :search-input.sync="FiltroCups" :items="cups" item-text="cups"
                                            item-value="id" label="Buscar procedimiento (CUP)" :loading="loadingCups"
                                            no-data-text="Debe ingresar mínimo 4 letras para buscar"
                                            prepend-icon="mdi-hospital-box" @change="guardarCupSeleccionado" />
                                    </v-col>


                                    <v-col cols="12" sm="4" class="d-flex justify-end align-end mb-6">
                                        <v-btn small color="success" @click="agregarCup" :disabled="!cupSeleccionado">
                                            <v-icon left>mdi-plus</v-icon>
                                            Agregar cup
                                        </v-btn>
                                    </v-col>
                                </v-row>

                                <v-data-table :headers="headersCups" :items="cupsSeleccionados" item-value="id" dense
                                    class="mt-2" :loading="loadingRelacionados"
                                    loading-text="Cargando cups asignados..."
                                    no-data-text="No hay procedimientos asignados aún">
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-btn icon small color="error" @click="quitarCup(item.id)">
                                            <v-icon small>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>

                                <v-btn text color="error" @click="cupsSeleccionados = []"
                                    v-if="cupsSeleccionados.length" class="mt-2">
                                    <v-icon left>mdi-delete-sweep</v-icon>
                                    Eliminar todos
                                </v-btn>
                            </v-card>
                        </v-tab-item>

                        <!-- Codesumi medicamentos -->
                        <v-tab-item>
                            <v-card flat class="mt-4">
                                <v-row align="center">
                                    <v-col cols="12" sm="8">
                                        <v-autocomplete dense outlined clearable v-model="codesumiSeleccionado"
                                            :search-input.sync="medicamento" :items="medicamentos" item-text="nombre"
                                            item-value="id" label="Buscar medicamento (Codesumi)"
                                            :loading="loadingMedicamentos"
                                            no-data-text="Debe ingresar mínimo 4 letras para buscar"
                                            prepend-icon="mdi-pill"></v-autocomplete>
                                    </v-col>

                                    <v-col cols="12" sm="4" class="d-flex justify-end align-end mb-6">
                                        <v-btn small color="success" @click="agregarCodesumi"
                                            :disabled="!codesumiSeleccionado">
                                            <v-icon left>mdi-plus</v-icon>
                                            Agregar codesumi
                                        </v-btn>
                                    </v-col>
                                </v-row>

                                <v-data-table :headers="headersCodesumis" :items="codesumisSeleccionados"
                                    item-value="id" dense class="mt-2" :loading="loadingRelacionados"
                                    loading-text="Cargando codesumis asignados..."
                                    no-data-text="No hay medicamentos asignados aún">
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-btn icon small color="error" @click="quitarCodesumi(item.id)">
                                            <v-icon small>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>

                                <v-btn text color="error" @click="codesumisSeleccionados = []"
                                    v-if="codesumisSeleccionados.length" class="mt-2">
                                    <v-icon left>mdi-delete-sweep</v-icon>
                                    Eliminar todos
                                </v-btn>
                            </v-card>
                        </v-tab-item>


                    </v-tabs-items>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn small color="error" @click="dialogParametrizacion = false"><v-icon
                            left>mdi-window-close</v-icon>Cerrar</v-btn>
                    <v-btn small color="success" @click="guardarParametrizacion" :loading="loadingGuardar"
                        :disabled="loadingGuardar">
                        <v-icon left>mdi-content-save</v-icon>
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
            {{ snackbar.text }}
            <v-btn text @click="snackbar.show = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

    </v-card>
</template>

<script>
export default {
    name: 'WorkspaceJsonPaquetesOrdenamiento',
    data() {
        return {
            paquetes: [],
            loading: false,
            dialog: false,
            modoDialogo: 'create',
            formData: {
                id: null,
                nombre: '',
            },
            formValid: false,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nombre', value: 'nombre' },
                { text: 'Activo', value: 'activo', align: 'center' },
                { text: 'Acciones', value: 'actions', sortable: false, align: 'center' },
            ],
            dialogParametrizacion: false,
            tab: null,
            paqueteSeleccionado: null,
            codesumisSeleccionados: [],
            headersCups: [
                { text: 'Código', value: 'codigo' },
                { text: 'Nombre', value: 'nombre' },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            headersCodesumis: [
                { text: 'Código', value: 'codigo' },
                { text: 'Nombre', value: 'nombre' },
                { text: 'Acciones', value: 'actions', sortable: false },
            ],
            medicamento: '',
            medicamentos: [],
            codesumiSeleccionado: null,
            loadingMedicamentos: false,
            loadingRelacionados: false,
            FiltroCups: '',
            cups: [],
            cupSeleccionado: null,
            cupsSeleccionados: [],
            loadingCups: false,
            cupObjSeleccionado: null,
            snackbar: {
                show: false,
                text: '',
                color: 'success',
            },
            loadingGuardar: false,
        };
    },
    mounted() {
        this.listarPaquetes();
    },
    watch: {
        medicamento(val) {
            if (val && val.length >= 4) {
                this.listarMedicamentos();
            } else if (!val || val.length < 4) {
                this.medicamentos = [];
            }
        },
        FiltroCups(val) {
            if (val && val.length >= 4) {
                this.listaCups();
            } else {
                this.cups = [];
            }
        }
    },
    methods: {
        async listarPaquetes() {
            this.loading = true;
            try {
                const res = await this.$axios.post('paquetes-ordenamientos/listar-paquetes');
                this.paquetes = res.data || [];
            } catch (e) {
                console.error('Error al listar paquetes:', e);
            } finally {
                this.loading = false;
            }
        },
        abrirDialogo(mode, item = null) {
            this.modoDialogo = mode;
            this.formData = item
                ? { ...item }
                : { id: null, nombre: '' };

            this.$nextTick(() => {
                if (this.$refs.form) this.$refs.form.resetValidation?.();
            });

            this.dialog = true;
        },
        async guardarPaquete() {
            const valid = await this.$refs.form.validate();
            if (!valid) return;

            try {
                const isCreate = this.modoDialogo === 'create';
                const url = isCreate
                    ? 'paquetes-ordenamientos/crear'
                    : `paquetes-ordenamientos/${this.formData.id}`;
                const method = isCreate ? 'post' : 'put';

                const payload = isCreate
                    ? { ...this.formData, activo: true }
                    : { ...this.formData };

                await this.$axios({ url, method, data: payload });
                this.dialog = false;
                this.listarPaquetes();
            } catch (e) {
                console.error('Error al guardar paquete:', e);
            }
        },
        async actualizarEstado(item) {
            try {
                const nuevoEstado = !item.activo;
                await this.$axios.put(`paquetes-ordenamientos/cambiarEstado/${item.id}`, {
                    activo: nuevoEstado,
                });
                this.listarPaquetes();
            } catch (e) {
                console.error('Error al cambiar estado:', e);
            }
        },
        abrirParametrizacion(item) {
            this.paqueteSeleccionado = item;
            this.dialogParametrizacion = true;
            this.cargarRelacionados(item.id);
        },

        quitarCup(id) {
            this.cupsSeleccionados = this.cupsSeleccionados.filter(c => c.id !== id);
        },

        quitarCodesumi(id) {
            this.codesumisSeleccionados = this.codesumisSeleccionados.filter(c => c.id !== id);
        },

        async cargarRelacionados(paqueteId) {
            this.cupsSeleccionados = [];
            this.codesumisSeleccionados = [];
        },

        async guardarParametrizacion() {
            this.loadingGuardar = true;
            try {
                const id = this.paqueteSeleccionado.id;

                await this.$axios.post(`paquetes-ordenamientos/${id}/asignar-codesumis`, {
                    codesumis: this.codesumisSeleccionados.map(c => c.id),
                });

                await this.$axios.post(`paquetes-ordenamientos/${id}/asignar-cups`, {
                    cups: this.cupsSeleccionados.map(c => c.id),
                });

                this.dialogParam = false;
                this.listarPaquetes();

                this.snackbar = {
                    show: true,
                    text: 'Parámetros guardados correctamente',
                    color: 'success',
                };
            } catch (e) {
                this.snackbar = {
                    show: true,
                    text: 'Ocurrió un error al guardar la parametrización',
                    color: 'error',
                };
            } finally {
                this.loadingGuardar = false;
            }
        },

        listarMedicamentos() {
            this.loadingMedicamentos = true;
            this.$axios.post('/medicamentos/listarVademecum', {
                nombre: this.medicamento
            })
                .then((res) => {
                    this.medicamentos = res.data.map(med => ({
                        id: med.codesumi_id,
                        nombre: `${med.codesumi.nombre}`,
                        codigo: med.codesumi.codigo,
                    }));
                })
                .catch(() => {
                    this.medicamentos = [];
                })
                .finally(() => {
                    this.loadingMedicamentos = false;
                });
        },

        agregarCodesumi() {
            const yaExiste = this.codesumisSeleccionados.some(c => c.id === this.codesumiSeleccionado);
            if (!yaExiste) {
                const selected = this.medicamentos.find(m => m.id === this.codesumiSeleccionado);
                if (selected) {
                    this.codesumisSeleccionados.push({ ...selected });
                }
            }
            this.codesumiSeleccionado = null;
            this.medicamento = '';
        },

        listaCups() {
            this.loadingCups = true;
            this.$axios.get(`/cup/BuscarCup/${this.FiltroCups}`).then(res => {
                const data = res.data?.original ?? [];
                this.cups = data.map(c => ({
                    id: c.id,
                    cups: `${c.codigo} - ${c.nombre}`,
                    codigo: c.codigo,
                    nombre: c.nombre,
                }));
            }).catch(() => {
                this.cups = [];
            }).finally(() => {
                this.loadingCups = false;
            });
        },

        guardarCupSeleccionado(id) {
            const selected = this.cups.find(c => c.id === id);
            if (selected) {
                this.cupObjSeleccionado = { ...selected };
            }
        },

        agregarCup() {
            const selected = this.cupObjSeleccionado;
            if (selected && !this.cupsSeleccionados.some(c => c.id === selected.id)) {
                this.cupsSeleccionados.push({ ...selected });
            }

            this.cupSeleccionado = null;
            this.FiltroCups = '';
            this.cupObjSeleccionado = null;
        },

        quitarCup(id) {
            this.cupsSeleccionados = this.cupsSeleccionados.filter(c => c.id !== id);
        },

        async cargarRelacionados(paqueteId) {
            this.loadingRelacionados = true;

            try {
                const resCups = await this.$axios.get(`/paquetes-ordenamientos/${paqueteId}/cups`);
                const resCodesumis = await this.$axios.get(`/paquetes-ordenamientos/${paqueteId}/codesumis`);

                if (resCups.data[0] === true) {
                    this.cupsSeleccionados = resCups.data[1].map(c => ({
                        id: c.id,
                        codigo: c.codigo,
                        nombre: c.nombre,
                    }));
                }

                if (resCodesumis.data[0] === true) {
                    this.codesumisSeleccionados = resCodesumis.data[1].map(c => ({
                        id: c.id,
                        codigo: c.codigo,
                        nombre: c.nombre,
                    }));
                }
            } catch (e) {
                this.cupsSeleccionados = [];
                this.codesumisSeleccionados = [];
            } finally {
                this.loadingRelacionados = false;
            }
        }


    },
};
</script>
