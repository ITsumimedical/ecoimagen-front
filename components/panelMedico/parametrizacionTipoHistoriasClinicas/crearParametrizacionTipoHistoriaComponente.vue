<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Parametrizacion tipos de historias</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="success" small @click="listarTiposHistoria()">Recargar tipos de historias <v-icon
                            right>mdi-reload</v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card-title>
            <v-container fluid>
                <v-expansion-panels inset>
                    <v-expansion-panel v-for="(item, i) in tiposHistoria" :key="i"
                        @click="listarComponentesHistoria(item.id)">
                        <v-expansion-panel-header><b> {{ i + 1 }}. {{ item.nombre }}</b></v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div class="d-flex flex-wrap">
                                <v-chip color="blue darken-1" dark v-for="(comp, index) in componentesHistoria"
                                    :key="index" label small class="ma-1">
                                    {{ index + 1 }}. {{ comp.nombre }}
                                </v-chip>
                            </div>
                            <div class="d-flex justify-end mt-2">
                                <v-btn small color="success"
                                    @click="abrirDialogoCrearTipoHistoria(componentesHistoria, item)">Agregar
                                    componentes<v-icon right>mdi-plus</v-icon>
                                </v-btn>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-container>
        </v-card>


        <v-dialog v-model="dialogoCrearTipoHistoria" max-width="1300px" persistent>
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <small>Agregar componentes a <b>{{ historiaSeleccionada?.nombre }}</b></small>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form ref="formParametrizacionHistoria">
                        <v-col cols="12">
                            <v-autocomplete label="Componentes" chips multiple small-chips deletable-chips
                                v-model="componenteHistoria.componentes" :loading="loading.listarComponentes"
                                :items="componentes" :rules="campoRequerido" item-text="nombre" dense item-value="id"
                                outlined @change="actualizarComponentesOrdenados">
                            </v-autocomplete>
                        </v-col>

                        <v-col cols="12" v-if="componentesOrdenados.length > 0">
                            <v-card outlined>
                                <v-card-title class="subtitle-1">
                                    Orden de los componentes
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon small v-bind="attrs" v-on="on" color="info">mdi-information-outline
                                            </v-icon>
                                        </template>
                                        <span>Arrastre los componentes para establecer el orden</span>
                                    </v-tooltip>
                                </v-card-title>
                                <v-card-text>
                                    <div ref="componentesContainer" class="componentes-container">
                                        <v-chip v-for="(comp, index) in componentesOrdenados" :key="comp.id"
                                            class="ma-1 pa-2 chip-ordenable" color="primary" label draggable
                                            :data-id="comp.id">
                                            {{ index + 1 }}. {{ comp.nombre }}
                                            <v-icon small right>mdi-drag</v-icon>
                                        </v-chip>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarDialogo()">
                        Cerrar <v-icon right>mdi-close</v-icon>
                    </v-btn>
                    <v-btn color="success" small @click="agregarComponentesTipoHistoria()"
                        :loading="loading.loadingAgregar">
                        Guardar registro <v-icon right>mdi-plus</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {
        mapActions
    } from "vuex";
    import dragula from 'dragula';

    export default {
        data() {
            return {
                dialogoCrearTipoHistoria: false,
                buscar: '',
                componentes: [],
                tiposHistoria: [],
                componentesHistoria: [],
                componentesOrdenados: [],
                historiaSeleccionada: {},
                datos: {},
                dragulaContainer: null,
                loading: {
                    listarComponentes: false,
                    loadingTipoHistoria: false,
                    loadingAgregar: false
                },
                campoRequerido: [
                    v => !!v || 'Este campo es requerido',
                ],
                componenteHistoria: {
                    componentes: []
                }
            }
        },

        mounted() {
            this.listarTiposHistoria();
        },

        methods: {
            ...mapActions("app", ["setPreload"]),

            abrirDialogoCrearTipoHistoria(componentesHistoria, item) {
                this.datos = componentesHistoria;
                this.historiaSeleccionada = item;
                this.dialogoCrearTipoHistoria = true;
                this.componenteHistoria.componentes = componentesHistoria ?.map(comp => comp.id) || [];
                this.listarComponentes();

                // Inicializar los componentes ordenados
                this.actualizarComponentesOrdenados();

                // Inicializar dragula después de que el DOM se actualice
                this.$nextTick(() => {
                    this.inicializarDragula();
                });
            },

            inicializarDragula() {
                // Destruir instancia previa si existe
                if (this.dragulaContainer) {
                    this.dragulaContainer.destroy();
                }

                // Crear nueva instancia de dragula
                const container = this.$refs.componentesContainer;
                if (container) {
                    this.dragulaContainer = dragula([container], {
                        moves: (el, container, handle) => {
                            return true;
                        }
                    });

                    // Cuando se suelta un elemento, actualizar el orden
                    this.dragulaContainer.on('drop', (el, target, source, sibling) => {
                        this.actualizarOrdenDespuesDeArrastre();
                    });
                }
            },

            actualizarOrdenDespuesDeArrastre() {
                // Obtener todos los chips en su nuevo orden
                const chipElements = this.$refs.componentesContainer.querySelectorAll('.chip-ordenable');
                const nuevosComponentesOrdenados = [];

                // Reconstruir el array de componentes en el nuevo orden
                chipElements.forEach(chip => {
                    const id = parseInt(chip.getAttribute('data-id'));
                    const componente = this.componentes.find(c => c.id === id);
                    if (componente) {
                        nuevosComponentesOrdenados.push(componente);
                    }
                });

                // Actualizar el array de componentes ordenados
                this.componentesOrdenados = nuevosComponentesOrdenados;
            },

            actualizarComponentesOrdenados() {
                this.componentesOrdenados = [];
                if (this.componenteHistoria.componentes && this.componenteHistoria.componentes.length > 0) {
                    this.componentesOrdenados = this.componenteHistoria.componentes.map(id => {
                        return this.componentes.find(comp => comp.id === id);
                    }).filter(comp => comp);
                }

                // Reiniciar dragula después de que se actualice el DOM
                this.$nextTick(() => {
                    this.inicializarDragula();
                });
            },

            listarComponentes() {
                this.loading.listarComponentes = true;
                this.$axios.get('componentes-historia-clinica/listar-componente-historia-clinica').then((res) => {
                    this.componentes = res.data;
                    this.actualizarComponentesOrdenados();
                }).catch(() => {
                    this.$toast.error('Error al listar componentes');
                }).finally(() => {
                    this.loading.listarComponentes = false;
                });
            },

            listarTiposHistoria() {
                this.setPreload(true);
                this.$axios.get('tipo-historia/').then((res) => {
                    this.tiposHistoria = res.data;
                }).catch(() => {
                    this.$toast.error('Error al cargar tipos de historia');
                }).finally(() => {
                    this.setPreload(false);
                });
            },

            cerrarDialogo() {
                // Destruir la instancia de dragula al cerrar
                if (this.dragulaContainer) {
                    this.dragulaContainer.destroy();
                    this.dragulaContainer = null;
                }

                this.dialogoCrearTipoHistoria = false;
                this.componenteHistoria = {
                    componentes: []
                };
                this.componentesOrdenados = [];
                this.$refs.formParametrizacionHistoria.resetValidation();
            },

            agregarComponentesTipoHistoria() {
                if (!this.$refs.formParametrizacionHistoria.validate()){
                    return
                };

                const componentesConOrden = this.componentesOrdenados.map((comp, index) => {
                    return {
                        id: comp.id,
                        orden: index + 1
                    };
                });

                const data = {
                    tipo_historia_id: this.historiaSeleccionada.id,
                    componentes: componentesConOrden
                };
                this.loading.loadingAgregar = true;
                this.$axios.post('tipo-historia/agregar-componentes-tipo-historia', data).then(() => {
                    this.$toast.success('Componentes agregados con éxito');
                    this.listarComponentesHistoria(this.historiaSeleccionada.id);
                    this.cerrarDialogo();
                }).catch(() => {
                    this.$toast.error('Error al agregar componentes');
                }).finally(() => {
                    this.loading.loadingAgregar = false;
                });
            },

            listarComponentesHistoria(item) {
                this.setPreload(true);
                this.$axios.get('tipo-historia/listar-componentes-tipo-historia/' + item).then((res) => {
                    this.componentesHistoria = res.data;
                }).catch((error) => {
                    this.$toast.error('Error al cargar componentes');
                }).finally(() => {
                    this.setPreload(false);
                });
            }
        },

        // Limpiar dragula cuando el componente se destruye
        beforeDestroy() {
            if (this.dragulaContainer) {
                this.dragulaContainer.destroy();
                this.dragulaContainer = null;
            }
        }
    }

</script>

<style scoped>
    .componentes-container {
        min-height: 100px;
        border: 1px dashed #ccc;
        padding: 10px;
        border-radius: 4px;
    }

    .chip-ordenable {
        cursor: grab;
    }

    .chip-ordenable:active {
        cursor: grabbing;
    }

    /* Estilos para Dragula */
    .gu-mirror {
        position: fixed !important;
        margin: 0 !important;
        z-index: 9999 !important;
        opacity: 0.8;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
        filter: alpha(opacity=80);
    }

    .gu-hide {
        display: none !important;
    }

    .gu-unselectable {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
    }

    .gu-transit {
        opacity: 0.2;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
        filter: alpha(opacity=20);
    }

</style>
