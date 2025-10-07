<template>
    <div>
        <v-dialog v-model="mostrarModalCargue" persistent max-width="1200px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-upload-multiple">
                    <v-row align="center">
                        <v-col class="grow">
                            <b>Cargue de Historias Clínicas Manuales</b>
                        </v-col>
                        <v-col class="shrink">
                            <v-btn small color="primary" v-show="$can('crear.tipoArchivos')" v-if="afiliado"
                                @click="modalTipoArchivo = true">
                                Crear Tipo de Archivo
                                <v-icon right small>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-alert>
                <v-card-text>
                    <v-form ref="formBuscarAfiliado">
                        <v-row dense>
                            <v-col cols="12" md="4" sm="12">
                                <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
                                    :loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id"
                                    item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento" :rules="[
                                        () =>
                                            !!datosBuscarAfiliado.tipo_documento ||
                                            'Este campo es requerido',
                                    ]" />
                            </v-col>
                            <v-col cols="12" md="4" sm="12">
                                <v-text-field dense outlined label="Número Documento" @keyup.enter="consultarAfiliado()"
                                    v-model.trim="datosBuscarAfiliado.numero_documento" :rules="[
                                        () =>
                                            !!datosBuscarAfiliado.numero_documento ||
                                            'Este campo es requerido',
                                    ]" />
                            </v-col>
                            <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                                <v-btn color="primary" dark small elevation="0" @click="consultarAfiliado()"
                                    style="width: 50%">Consultar <v-icon right>mdi-magnify</v-icon></v-btn>
                                <v-btn color="red" dark small elevation="0" @click="limpiarAfiliado()"
                                    style="width: 50%">Limpiar<v-icon right>mdi-close</v-icon></v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row dense v-if="afiliado">
                        <AfiliadoComponent :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" />
                    </v-row>
                    <v-form ref="formCargueHistoriasManual">
                        <v-row dense v-if="afiliado" class="mt-8">
                            <v-col cols="12" sm="4" md="4">
                                <v-autocomplete dense label="Tipo de Archivo *" :items="tiposArchivo"
                                    :loading="loading.tiposArchivos" no-data-text="No hay resultados" item-value="id"
                                    item-text="nombre" v-model="formCargue.tipo_archivo_id"
                                    prepend-icon="mdi-file-document-outline" :rules="[
                                        () =>
                                            !!formCargue.tipo_archivo_id || 'Este campo es requerido',
                                    ]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-menu dense v-model="menuFechaProceso" :close-on-content-click="false"
                                    :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="formCargue.fecha_proceso" label="Fecha Proceso *" :max="hoy"
                                            prepend-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on" :rules="[
                                                () =>
                                                    !!formCargue.fecha_proceso ||
                                                    'Este campo es requerido',
                                            ]"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="formCargue.fecha_proceso" @input="menuFechaProceso = false" :max="hoy"
                                        :rules="[
                                            () =>
                                                !!formCargue.fecha_proceso || 'Este campo es requerido',
                                        ]"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-file-input dense show-size truncate-length="50" v-model="formCargue.adjuntos"
                                    accept=".pdf" label="Archivo *" placeholder="Seleccione el archivo" :rules="[
                                        () => !!formCargue.adjuntos || 'Este campo es requerido',
                                    ]"></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" v-if="
                                formCargue.tipo_archivo_id === 1 ||
                                formCargue.tipo_archivo_id === 14
                            ">
                                <v-autocomplete 
                                    dense 
                                    label="Sede *" 
                                    :items="opcionesRep" 
                                    :loading="loading.reps"
                                    item-value="id" 
                                    item-text="nombre" 
                                    no-data-text="Digite el nombre de la sede para buscar." 
                                    v-model="formCargue.rep_id"
                                    prepend-icon="mdi-hospital-building" 
                                    :rules="[() => !!formCargue.rep_id || 'Este campo es requerido']"
                                    @click="listarReps()"
                                    >
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" v-if="
                                formCargue.tipo_archivo_id === 1 ||
                                formCargue.tipo_archivo_id === 14
                            ">
                                <v-autocomplete dense label="Servicio *" :items="opcionesCup" :loading="loading.cups"
                                    item-value="id" item-text="nombre" :search-input.sync="campoBusquedaCup"
                                    no-data-text="Digite el nombre del servicio para buscar."
                                    v-model="formCargue.cup_id" prepend-icon="mdi-needle" :rules="[
                                        () => !!formCargue.cup_id || 'Este campo es requerido',
                                    ]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" v-if="
                                formCargue.tipo_archivo_id === 1 ||
                                formCargue.tipo_archivo_id === 14
                            ">
                                <v-autocomplete dense label="Diagnóstico *" :items="opcionesCie10"
                                    :loading="loading.cie10s" item-value="id" item-text="Codigo_Nombre"
                                    :search-input.sync="campoBusquedaCie10"
                                    no-data-text="Digite el nombre del diagnóstico para buscar."
                                    v-model="formCargue.cie10_id" prepend-icon="mdi-hospital-box-outline" :rules="[
                                        () => !!formCargue.cie10_id || 'Este campo es requerido',
                                    ]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" v-if="
                                formCargue.tipo_archivo_id === 1 ||
                                formCargue.tipo_archivo_id === 14
                            ">
                                <v-autocomplete dense label="Médico *" :items="opcionesMedico"
                                    :loading="loading.medicos" item-value="user_id" item-text="nombreDocumento"
                                    :search-input.sync="campoBusquedaMedico"
                                    no-data-text="Digite el nombre del médico para buscar."
                                    v-model="formCargue.medico_ordena_id" prepend-icon="mdi-doctor" :rules="[
                                        () =>
                                            !!formCargue.medico_ordena_id ||
                                            'Este campo es requerido',
                                    ]"></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
                    <v-btn color="success" small @click="guardarHistoriaManual()" :disabled="!afiliado">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal Creación Tipo de Archivo -->
        <v-dialog v-model="modalTipoArchivo" persistent max-width="800px">
            <v-card>
                <v-alert dense text border="left" color="primary" icon="mdi-order-bool-descending-variant"
                    class="text-center">
                    <b>Tipo archivo</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="formCrearTipoArchivo">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="formTipoArchivo.nombre" label="Nombre *"
                                    :rules="[(v) => !!v || 'Este campo es requerido']" dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea v-model="formTipoArchivo.descripcion" label="Descripción *" :rules="[
                                    (v) => !!v || 'Este campo es requerido',
                                    (v) =>
                                        v.length >= 10 ||
                                        'Este campo debe tener al menos 10 caracteres',
                                ]" dense auto-grow></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarModalTipoArchivo()">Cancelar</v-btn>
                    <v-btn small color="success" @click="guardarTipoArchivo()">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import moment from "moment";
import { mapActions } from "vuex";
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    props: {
        mostrarModalCargue: Boolean,
    },
    components: {
        AfiliadoComponent,
    },
    data() {
        return {
            hoy: this.$moment().format("YYYY-MM-DD"),
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            afiliado: null,
            loading: {
                tiposDocumentos: false,
                tiposArchivos: false,
                reps: false,
                cups: false,
                cie10s: false,
                medicos: false,
            },
            tiposDocumentos: [],
            modalTipoArchivo: false,
            formTipoArchivo: {
                nombre: "",
                descripcion: "",
            },
            tiposArchivo: [],
            formCargue: {
                tipo_archivo_id: null,
                afiliado_id: null,
                fecha_hora_inicio: null,
                fecha_proceso: null,
                adjuntos: null,
                rep_id: null,
                cup_id: null,
                cie10_id: null,
                medico_ordena_id: null,
            },
            menuFechaProceso: false,
            opcionesRep: [],
            opcionesCup: [],
            opcionesCie10: [],
            opcionesMedico: [],
            campoBusquedaCup: null,
            campoBusquedaCie10: null,
            campoBusquedaMedico: null,
            banderas:{
                reps: false
            },
        };
    },
    watch: {
        mostrarModalCargue(newValue) {
            if (newValue) {
                this.listarTiposDocumentos();
                this.listarTiposArchivo();
            }
        },
        campoBusquedaCup(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarCups();
            }
        },
        campoBusquedaCie10(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarCie10s();
            }
        },
        campoBusquedaMedico(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarMedicos();
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.limpiarAfiliado();
            this.limpiarFormularioCargue();
            this.$refs.formBuscarAfiliado.resetValidation();
            this.$emit("update:mostrarModalCargue", false);
        },

        listarTiposDocumentos() {
            this.loading.tiposDocumentos = true;
            this.$axios
                .get("/tipo-documento/listar")
                .then((res) => {
                    this.tiposDocumentos = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de documento"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tiposDocumentos = false;
                });
        },

        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.$refs.formBuscarAfiliado.resetValidation();
            this.afiliado = null;
        },

        consultarAfiliado() {
            if (!this.$refs.formBuscarAfiliado.validate()) {
                this.$toast.error(
                    "Por favor ingrese el tipo de documento y el número de documento."
                );
                return;
            }

            this.afiliado = null;

            this.setPreload(true);
            this.$axios
                .get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                )
                .then((res) => {
                    this.afiliado = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        cerrarModalTipoArchivo() {
            this.formTipoArchivo = {
                nombre: "",
                descripcion: "",
            };
            this.$refs.formCrearTipoArchivo.resetValidation();
            this.modalTipoArchivo = false;
        },

        guardarTipoArchivo() {
            if (!this.$refs.formCrearTipoArchivo.validate()) {
                this.$toast.error("Por favor complete los campos requeridos");
                return;
            }

            this.setPreload(true);
            this.$axios
                .post("/tipo-archivo/crear", this.formTipoArchivo)
                .then((res) => {
                    this.$toast.success("Tipo de Archivo creado exitosamente");
                    this.cerrarModalTipoArchivo();
                    this.listarTiposArchivo();
                })
                .catch((error) => {
                    this.$toast.error("Error al crear el tipo de archivo");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarTiposArchivo() {
            this.loading.tiposArchivos = true;
            this.$axios
                .get("/tipo-archivo/listar")
                .then((res) => {
                    this.tiposArchivo = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar los tipos de archivo");
                })
                .finally(() => {
                    this.loading.tiposArchivos = false;
                });
        },

        guardarHistoriaManual() {
            if (!this.$refs.formCargueHistoriasManual.validate()) {
                this.$toast.error("Por favor complete los campos requeridos");
                return;
            }

            const formData = new FormData();
            formData.append(`tipo_archivo_id`, this.formCargue.tipo_archivo_id);
            formData.append(`afiliado_id`, this.afiliado.id);
            formData.append(`fecha_hora_inicio`, this.formCargue.fecha_proceso);
            formData.append(`fecha_proceso`, this.formCargue.fecha_proceso);
            formData.append(`adjuntos`, this.formCargue.adjuntos);

            if (
                this.formCargue.tipo_archivo_id === 1 ||
                this.formCargue.tipo_archivo_id === 14
            ) {
                formData.append("rep_id", this.formCargue.rep_id);
                formData.append("cup_id", this.formCargue.cup_id);
                formData.append("cie10_id", this.formCargue.cie10_id);
                formData.append("medico_ordena_id", this.formCargue.medico_ordena_id);
            }

            this.setPreload(true);
            this.$axios
                .post(`/cargue-historia-contingencia/crear`, formData)
                .then((res) => {
                    this.$toast.success("Historia Clínica cargada exitosamente");
                    this.cerrarModal();
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar la historia");
                    console.log(e);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarFormularioCargue() {
            this.formCargue = {
                tipo_archivo_id: null,
                afiliado_id: null,
                fecha_hora_inicio: null,
                fecha_proceso: null,
                adjuntos: null,
                rep_id: null,
                cup_id: null,
                cie10_id: null,
            };
            this.$refs.formCargueHistoriasManual.resetValidation();
        },

        listarReps() {
            // si ya se hizo la busqueda no hacerla nuevamente
            if(this.banderas.reps) return;

            this.loading.reps = true;
            this.$axios
                .get(`/reps/propias/listarPropiasActivas`)
                .then((res) => {
                    this.opcionesRep = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre} - ${rep.codigo}`,
                        };
                    });
                    this.banderas.reps = true;
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar los reps");
                })
                .finally(() => {
                    this.loading.reps = false;
                });
        },

        listarCups() {
            this.loading.cups = true;
            this.$axios
                .post("/cup/buscarCupsNombre", {
                    nombre: this.campoBusquedaCup,
                    idAfiliado: this.afiliado.id,
                })
                .then((res) => {
                    this.opcionesCup = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar los servicios");
                })
                .finally(() => {
                    this.loading.cups = false;
                });
        },

        listarCie10s() {
            this.loading.cie10s = true;
            this.$axios
                .post("/cie10/listarFiltro", {
                    valor: this.campoBusquedaCie10,
                })
                .then((res) => {
                    this.opcionesCie10 = res.data;
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al cargar los diagnósiticos");
                })
                .finally(() => {
                    this.loading.cie10s = false;
                });
        },

        listarMedicos() {
            this.loading.medicos = true;
            this.$axios
                .post("/operador/listarFiltro", {
                    nombre: this.campoBusquedaMedico,
                })
                .then((res) => {
                    this.opcionesMedico = res.data.map((operador) => {
                        return {
                            nombreDocumento: `${operador.nombre || ''} ${operador.apellido || ''} - ${operador.documento}`,
                            ...operador,
                        };
                    });
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al cargar los médicos");
                })
                .finally(() => {
                    this.loading.medicos = false;
                });
        },
    },
};
</script>
