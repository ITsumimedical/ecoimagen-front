<template>
    <div>
        <!-- Preload -->
        <!-- <template>
            <div class="text-center">
                <v-dialog v-model="preload" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template> -->

        <v-card flat>
            <v-form ref="formIngreso" v-model="valid" lazy-validation>
                <v-container fluid>
                    <v-row no-gutters class="flex-wrap">
                        <!-- FORMULARIO -->
                        <v-col cols="12" md="6" class="pa-2">
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-checkbox v-model="checkbox_Afiliado"
                                            label="¿La barrera de acceso es de un paciente?"></v-checkbox>
                                    </v-col>

                                    <v-col cols="12" sm="6" v-if="checkbox_Afiliado">
                                        <v-select dense v-model="barrera.tipo_documento"
                                            label="Tipo de documento del afiliado"
                                            :error-messages="errores.tipo_documento" :items="listaTipoDocs"
                                            item-value="id" item-text="nombre" :rules="rules.campoObligatorio"
                                            outlined></v-select>
                                    </v-col>

                                    <v-col cols="12" sm="6" v-if="checkbox_Afiliado">
                                        <v-text-field dense v-model="barrera.cedula_paciente"
                                            label="Ingrese el número de documento del afiliado"
                                            append-icon="mdi-magnify" hide-details single-line
                                            :error-messages="errores.cedula_paciente" :rules="rules.campoObligatorio"
                                            outlined></v-text-field>
                                    </v-col>

                                    <v-col cols="12" class="text-right" v-if="checkbox_Afiliado">
                                        <v-btn color="primary" dense dark @click="buscar_afiliado()">
                                            BUSCAR
                                        </v-btn>
                                    </v-col>

                                    <v-col cols="12" v-if="checkbox_Afiliado">
                                        <v-alert text dense border="left" dark color="blue darken-2">
                                            <b>Nombre Completo: </b>
                                            <p v-if="nombreCompletoAfiliado">{{ nombreCompletoAfiliado }}</p>
                                            <b>Entidad: </b>
                                            <p v-if="afiliados.entidad">{{ afiliados.entidad.nombre }}</p>
                                        </v-alert>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-checkbox v-model="checkbox_sede"
                                            label="¿La barrera de acceso es de una sede?"></v-checkbox>
                                    </v-col>

                                    <v-col cols="12" v-if="checkbox_sede">
                                        <v-autocomplete v-model="barrera.rep_id"
                                            label="Nit o Nombre del Prestador (Institución de Atención)" :items="reps"
                                            item-value="id" item-text="nombre" :search-input.sync="rep"
                                            :error-messages="errores.rep_id" dense :rules="rules.campoObligatorio"
                                            outlined></v-autocomplete>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-checkbox v-model="checkbox_general"
                                            label="¿Es una barrera General?"></v-checkbox>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-file-input dense outlined v-model="barrera.adjuntos"
                                            label="Adjuntar Archivos" counter show-size append-icon="mdi-paperclip"
                                            small-chips multiple clearable
                                            accept=".jpg, .jpeg, .png, .pdf"></v-file-input>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-autocomplete v-model="barrera.barrera" label="Barrera de Acceso"
                                            :items="barreras" return-object item-text="nombre"
                                            :error-messages="errores.barrera" dense :rules="rules.campoObligatorio"
                                            :loading="loading" outlined></v-autocomplete>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-textarea filled auto-grow v-model="barrera.observacion" label="Observación"
                                            :error-messages="errores.observacion" dense
                                            :rules="rules.campoObligatorio"></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>

                        <v-col cols="12" md="6" class="d-flex justify-center align-center pa-1">
                            <v-img src="/images/inBar.png" max-width="100%" max-height="100%" contain
                                class="rounded-lg elevation-1"></v-img>
                        </v-col>
                    </v-row>
                </v-container>

            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <!-- <v-btn color="red" small dark @click="limpiarFormulario">
                    Cerrar
                </v-btn> -->
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                            <v-icon left>mdi-information-variant</v-icon>
                        </span>
                    </template>
                    <span><b>¿Sabes cómo reporta una barrera de acceso?</b>
                        <hr>
                        <p>Reportar cualquier <b>falla de acceso</b> a los servicios de salud, como la demora en las
                            <b>autorizaciones y entrega de medicamentos, suspensión de los servicios públicos sin plan
                                de
                                contigencia</b>, entre
                            otras limitaciones que afectan el acceso y continuidad para la atención.
                        </p>
                    </span>
                </v-tooltip>
                <v-btn color="boton" small dark @click="guardarBarrera()">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    middleware({ $can, redirect }) {
        if (!$can("asegurador.menu.barreraAcceso")) {
            return redirect("/");
        }
    },

    name: "FormBarreraAccesoComponent",

    data() {
        return {
            listaTipoDocs: [],
            barreras: [],
            loading: false,
            checkbox_Afiliado: false,
            checkbox_sede: false,
            checkbox_general: false,
            afiliados: [],
            barreaAccesos: [],
            barrera: {
                barrera: null,
                cedula_paciente: null,
                tipo_documento: null,
                observacion: null,
                rep_id: null,
                adjuntos: [],
            },
            errores: {
                barrera: null,
                observacion: null,
                rep_id: null,
                cedula_paciente: null,
            },
            reps: null,
            preload: false,
            rep: null,
            valid: false,
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ],
            },
        };
    },

    mounted() {
        this.listarTipoDocumentos();
        this.listarTiposBarrerasAcceso();
    },

    computed: {
        nombreCompletoAfiliado() {
            const a = this.afiliados || {};
            return [
                a.primer_nombre,
                a.segundo_nombre,
                a.primer_apellido,
                a.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');
        }
    },

    watch: {
        rep(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarReps();
                } else if (val.length < 4) {
                    this.reps = null;
                }
            } else {
                this.reps = null;
            }
        },
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        listarTipoDocumentos() {
            this.$axios
                .get("/tipo-documento/listar")
                .then((res) => {
                    this.listaTipoDocs = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de documento"
                    );
                    console.log(error);
                });
        },

        listarReps() {
            this.setPreload(true);
            this.$axios
                .post("reps/listarConfiltro?page=0", { rep: this.rep })
                .then((res) => {
                    if (res.data.length >= 2) {
                        this.setPreload(false);
                        this.reps = res.data.map((rep) => {
                            return {
                                id: rep.id,
                                nombre: `${rep.nombre}`,
                            };
                        });
                    } else if (res.data.length == 1) {
                        this.setPreload(false);
                        this.filtro.prestador_id = res.data[0].prestador_id;
                        this.reps = res.data.map((rep) => {
                            return {
                                id: rep.id,
                                nombre: `${rep.nombre}`,
                            };
                        });
                    }
                })
                .catch((e) => {
                    this.setPreload(false);
                    console.log(e);
                });
        },

        buscar_afiliado() {
            if (this.barrera.cedula_paciente == null) {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Debe ingresar el número de documento de un afiliado para realizar la búsqueda",
                    type: "warning",
                });
            }
            this.setPreload(true);
            this.$axios
                .get(
                    `/afiliados/${this.barrera.cedula_paciente}/${this.barrera.tipo_documento}`
                )
                .then((res) => {
                    this.afiliados = res.data;
                    this.setPreload(false);
                })
                .catch((e) => {
                    this.setPreload(false);
                    this.$toast.error(e.response.data.error);
                });
        },

        Error(errores) {
            for (const key in this.errores) {
                if (key in errores) {
                    this.errores[key] = errores[key].join(", ");
                }
            }
        },

        limpiarError() {
            for (const key in this.errores) {
                this.errores[key] = null;
            }
        },

        limpiarFormulario() {
            for (const key in this.barrera) {
                this.barrera[key] = null;
            }
            this.checkbox_Afiliado = false;
            this.checkbox_sede = false;
            this.checkbox_general = false;
            this.afiliados = [];
            this.reps = null;
            this.rep = null;
            this.$emit("respuestaComponente");
        },

        guardarBarrera() {
            if (!this.$refs.formIngreso.validate()) {
                return;
            }

            this.limpiarError();
            this.setPreload(true);

            const formData = new FormData();
            formData.append("descripcion", this.barrera.descripcion);

            for (let i = 0; i < this.barrera.adjuntos.length; i++) {
                formData.append("adjuntos[]", this.barrera.adjuntos[i]);
            }

            if (this.afiliados && this.afiliados.id) {
                formData.append("afiliado_id", this.afiliados.id);
            }

            if (this.barrera.rep_id) {
                formData.append("rep_id", this.barrera.rep_id);
            }

            // formData.append("afiliado_id", this.afiliados.id);
            formData.append("barrera", this.barrera.barrera.nombre);
            formData.append("tipo_barrera_acceso_id", this.barrera.barrera.id);
            formData.append("observacion", this.barrera.observacion);
            // formData.append("rep_id", this.barrera.rep_id);
            formData.append("barrera_general", this.checkbox_general ? '1' : '0');

            this.$axios
                .post("/barrera-acceso/crear", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((res) => {
                    this.$swal({
                        type: "success",
                        title: "¡Éxito!",
                        text: `Sr(a) su solicitud fue radicada con éxito N° de radicado ${res.data[0].id} y tipo de barrera ${res.data[0].barrera}.`,
                    });
                    this.limpiarFormulario();
                })
                .catch((error) => {
                    this.setPreload(false);
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje);
                    } else if (error.response.data) {
                        this.Error(error.response.data);
                    }
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarTiposBarrerasAcceso() {
            this.loading = true;
            this.$axios.get(
                "/tipo-barrera-acceso/listar-tipos-barrera_acceso-activos")
                .then((res) => {
                    this.barreras = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al listar los tipos de barreras acceso");
                })
                .finally(() => {
                    this.loading = false;
                })
        },
    },
};
</script>
