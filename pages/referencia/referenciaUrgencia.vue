<template>
    <div>
        <v-card>
            <!-- Generar Anexo -->
            <v-alert dense text outlined color="blue" class="text-center">
                <strong>Generar Anexo</strong>
            </v-alert>
            <!-- <pre>{{documentos}}</pre> -->
            <!-- formulario -->
            <v-container fluid>
                <!-- escoger el anexo -->
                <v-col cols="12" sm="12" md="12">
                    <v-row justify="center">
                        <v-radio-group v-model="data.tipo_anexo" mandatory>
                            <v-radio value="2"><template v-slot:label>
                                    <div>
                                        Urgencias (Anexo 2)
                                        <strong class="error--text">
                                            USO EXCLUSIVO PARA CÓDIGOS DE ATENCIÓN DE URGENCIAS POR
                                            IPS
                                        </strong>
                                    </div>
                                </template></v-radio>
                            <v-radio label="Solicitud de Autorización (Anexo 3)" value="3"></v-radio>
                            <v-radio label="Remisiones (Anexo 9)" value="9"></v-radio>
                            <!-- <v-radio label="Contrareferencia (Anexo 10)" value="10"></v-radio> -->
                        </v-radio-group>
                    </v-row>
                </v-col>

                <!-- formulario -->
                <form @submit.prevent="submit">
                    <v-row>
                        <v-col cols="12" sm="12" md="3">
                            <v-autocomplete :items="especialidades" label="Especialidad"
                                v-model="data.Especialidad_remi" outlined dense></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="9">
                            <v-autocomplete :items="cie10" item-text="Codigo_Nombre" item-value="id"
                                label="Diagnosticos Cie10" multiple outlined dense chips v-model="data.cie10s">
                                <template v-slot:selection="data">
                                    <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select"
                                        @click:close="remove(data.item)">{{ data.item.Codigo_Nombre }}
                                    </v-chip>
                                </template>
                            </v-autocomplete>
                        </v-col>
                    </v-row>

                    <!-- Observaciones de cualquier remision -->
                    <v-textarea :label="'Observación'" v-model="data.descripcion" :counter="300" outline>
                    </v-textarea>

                    <!-- Adjuntos de cualquier remision -->
                    <v-row>
                        <v-col cols="12" sm="12" md="9">
                            <v-file-input accept=".pdf, .docx, .xlsx, .jpeg, .jpg, .png" v-model="data.adjuntohistoria"
                                color="titulo" counter label="Seleccione los archivos" multiple
                                placeholder="Seleccione los archivos" prepend-icon="mdi-paperclip" outlined dense
                                :show-size="1000">
                                <template v-slot:selection="{ index, text }">
                                    <v-chip v-if="index < 2" color="titulo black--text" dark label small>
                                        {{ text }}
                                    </v-chip>

                                    <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                        +{{ files.length - 2 }} File(s)
                                    </span>
                                </template>
                            </v-file-input>
                        </v-col>

                        <v-col cols="12" sm="12" md="3">
                            <span>adjunte <strong>Historia clinica</strong></span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="9">
                            <v-file-input accept=".pdf, .docx, .xlsx, .jpeg, .jpg, .png" v-model="data.adjuntoRemision"
                                color="titulo" counter label="Seleccione los archivos" multiple
                                placeholder="Seleccione los archivos" prepend-icon="mdi-paperclip" outlined dense
                                :show-size="1000">
                                <template v-slot:selection="{ index, text }">
                                    <v-chip v-if="index < 2" color="titulo black--text" dark label small>
                                        {{ text }}
                                    </v-chip>

                                    <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                        +{{ files.length - 2 }} File(s)
                                    </span>
                                </template>
                            </v-file-input>
                        </v-col>

                        <v-col cols="12" sm="12" md="3">
                            <span>adjunte <strong>Anexo</strong></span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="9">
                            <v-file-input accept=".pdf, .docx, .xlsx, .jpeg, .jpg, .png" v-model="data.adjuntoOtros"
                                color="titulo" counter label="Seleccione los archivos" multiple
                                placeholder="Seleccione los archivos" prepend-icon="mdi-paperclip" outlined dense
                                :show-size="1000">
                                <template v-slot:selection="{ index, text }">
                                    <v-chip v-if="index < 2" color="titulo black--text" dark label small>
                                        {{ text }}
                                    </v-chip>

                                    <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                        +{{ files.length - 2 }} File(s)
                                    </span>
                                </template>
                            </v-file-input>
                        </v-col>

                        <v-col cols="12" sm="12" md="3">
                            <span>adjunte <strong>Otros Archivos</strong></span>
                        </v-col>
                    </v-row>

                    <!-- Check de autorizacion de datos personales -->
                    <v-checkbox color="primary" v-model="datos_personales" dense
                        label="Recuerde que los datos personales de los usuarios se debe tratar según la ley 1551 de 2012">
                    </v-checkbox>
                </form>

                <v-divider></v-divider>
                <!-- botones de cancelar la remision o crear una remision -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="limpiarForms(),volver()">
                        Cancelar Remision
                    </v-btn>
                    <v-btn color="boton" @click="CrearReferencia()" dark>
                        Enviar Remision
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>

        <!-- preload de carga -->
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Procesando Información
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        middleware({
            $can,
            redirect
        }) {
            if (!$can("referencia.crear")) {
                return redirect("/");
            }
        },
        props: {
            documentos: Object
        },
        data: () => ({
            cedulaAfiliado: null,
            componenteAfiliado: false,
            checkbox1: false,
            preload: null,
            componente: null,
            datos: {},
            cie10: [],
            domiciliaria: {
                acceso: null,
                vivienda: null,
                tipo: null,
                piso: null,
                presencia: null,
                animal: null,
                coccion: null,
                direccion: null,
                viven: null,
                cuantas: null,
                cuidador: null,
                peso: null,
                talla: null,
                barthel: null,
                karnosky: null,
            },
            data: {
                adjuntohistoria: [],
                adjuntoRemision: [],
                adjuntoOtros: [],
                cie10s: [],
                Especialidad_remi: null,
                tipo_anexo: null,
                descripcion: null,
            },
            datos_personales: null,
            especialidades: [
                "ALERGOLOGIA",
                "ANESTESIOLOGIA",
                "AUDIOLOGIA",
                "BIOENERGETICA",
                "CARDIOLOGIA",
                "CIRUGIA BARIATRICA",
                "CIRUGIA CARDIOVASCULAR",
                "CIRUGIA GENERAL",
                "CIRUGIA MAXILOFACIAL",
                "CIRUGIA PLASTICA",
                "COLOPROCTOLOGIA",
                "COORDINACION MEDICA",
                "DERMATOLOGIA",
                "ENDOCRINOLOGIA",
                "GINECOLOGIA Y OBSTETRICIA",
                "HEMATOLOGIA",
                "INFECTOLOGIA",
                "MASTOLOGIA",
                "MEDICINA DEL DEPORTE",
                "MEDICINA DEL DOLOR",
                "MEDICINA DEL TRABAJO",
                "MEDICINA FAMILIAR",
                "MEDICINA FISICA Y REHABILITACION",
                "MEDICINA GENERAL",
                "MEDICINA INTERNA",
                "NEFROLOGIA",
                "NEUMOLOGIA",
                "NEUROCIRUGIA",
                "NEUROLOGIA",
                "ODONTOLOGIA",
                "OFTALMOLOGIA",
                "ONCOLOGIA CLINICA",
                "ORTOPEDIA Y TRAUMATOLOGIA",
                "OTORRINOLARINGOLOGIA",
                "PEDIATRIA",
                "PSIQUIATRIA",
                "REUMATOLOGIA",
                "SALUD FAMILIAR",
                "TOXICOLOGIA CLINICA",
                "UROLOGIA",
            ],
        }),

        mounted() {
            this.listarCie10();
        },

        methods: {
            realizarBusqueda(cedula, tipoDocumento) {
                this.preload = true;
                this.$loadingGetRequest(buscarAfiliado(cedula, tipoDocumento)).then((res) => {
                    this.componente = "AfiliadoComponent";
                    this.componenteAfiliado = true;
                    this.datos = res.data;
                    this.preload = false;
                }).catch(error => {
                    this.limpiarForms()
                    this.preload = false;
                    this.$toast.error(error.response.data.error);
                    console.log(error)
                });
            },

            /*
            ! listar los Cie10
            * @return Object cie10
            */
            listarCie10() {
                this.$axios
                    .get("cie10/listarc10")
                    .then((res) => {
                        this.cie10 = res.data;
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },

            /*
            ! remueve los cie10 que no se van a usar
            */
            remove(item) {
                const index = this.data.cie10s.findIndex((i) => i === item.id);
                if (index >= 0) this.data.cie10s.splice(index, 1);
            },

            /*
            ! limpia todo el form
            */
            limpiarForms() {
                this.cedulaAfiliado = null;
                this.componenteAfiliado = false;
                this.componente = null;
                this.datos = {};
                this.cie10 = [];
                this.data.adjuntohistoria = [];
                this.data.adjuntoRemision = [];
                this.data.adjuntoOtros = [];
                this.data.cie10s = [];
                this.data.Especialidad_remi = null;
                this.data.tipo_anexo = null;
                this.datos_personales = null;
                this.data.descripcion = null;
                // this.$refs.buscarAfiliado.limpiarFormulario();
            },

            /*
            ! crear una referencia
            * @param cedulaAfiliado cedula del afiliado
            * @return object datos
            */
            CrearReferencia() {
                if (this.datos_personales == null) {
                    return this.$swal({
                        type: "error",
                        title: "¡Ojo!",
                        text: "Debe aceptar los datos personales del usuario",
                    });
                }
                if (this.data.cie10s.length == 0) {
                    return this.$swal({
                        type: "error",
                        title: "¡Ojo!",
                        text: "Debe escoger al menos un CIE10",
                    });
                }
                if (this.data.Especialidad_remi == null) {
                    return this.$swal({
                        type: "error",
                        title: "¡Ojo!",
                        text: "Debe escoger una especialidad",
                    });
                }
                if (this.data.adjuntohistoria.length == 0) {
                    return this.$swal({
                        type: "error",
                        title: "¡Ojo!",
                        text: "Debe adjuntar la historia clinica del paciente",
                    });
                }

                if (this.data.adjuntoRemision.length == 0) {
                    return this.$swal({
                        type: "error",
                        title: "¡Ojo!",
                        text: "Debe adjuntar el anexo a enviar",
                    });
                }
                this.preload = true;
                const formData = new FormData();
                formData.append(`tipo_anexo`, this.data.tipo_anexo);
                formData.append(`especialidad_remision`, this.data.Especialidad_remi);
                formData.append(`afiliado_id`, this.documentos.numero_documento);
                formData.append(`entidad_id`, this.documentos.entidad_id);
                formData.append(`tipo_anexo`, this.data.tipo_anexo);
                formData.append(`descripcion`, this.data.descripcion);
                formData.append(`adjuntoOtros`, []);
                formData.append(`adjuntohistoria`, this.data.adjuntohistoria[0]);
                formData.append(`adjuntoRemision`, this.data.adjuntoRemision[0]);


                for (let i = 0; i < this.data.cie10s.length; i++) {
                    formData.append(`cie10s[]`, this.data.cie10s[i]);
                }

                for (let i = 0; i < this.data.adjuntoOtros.length; i++) {
                    formData.append(`adjuntoOtros[]`, this.data.adjuntoOtros[i]);
                }
                if (this.documentos.entidad_id == 1) {
                    this.$axios
                        .post("/referencias/crearUrgencia", formData)
                        .then((res) => {
                            this.preload = false;
                            // this.$toast.success(res.data.mensaje);
                            this.limpiarForms();
                            this.listarCie10();
                        })
                        .catch((error) => {
                            this.preload = false;
                            // if (error.response.data.mensaje) {
                            //   this.$toast.error(error.response.data.mensaje);
                            // } else if (error.response.data) {}
                        });
                } else {
                    this.$axios
                        .post("/referencias/crear", formData)
                        .then((res) => {
                            this.preload = false;
                            this.$toast.success(res.data.mensaje);
                            this.limpiarForms();
                            this.listarCie10();
                        })
                        .catch((error) => {
                            this.preload = false;
                            // if (error.response.data.mensaje) {
                            //   this.$toast.error(error.response.data.mensaje);
                            // } else if (error.response.data) {}
                        });
                }

            },

            volver() {
                this.$emit("cerrarModal");
            }
        },
    };

</script>
