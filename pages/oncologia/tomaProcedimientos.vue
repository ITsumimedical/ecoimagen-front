<template>
    <div>
        <v-card>
            <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                <b>TOMA DE PROCEDIMIENTOS</b>
            </v-alert>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="2" sm="4">
                        <v-autocomplete label="Selecciona el tipo de radicación" :rules="camposRequeridos"
                            v-model="form.tipo_radicacion" append-icon="mdi-arrow-down-drop-circle-outline"
                            :items="tipoRadicacion" dense clearable @change="limpiarFormulario()" required>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" sm="4">
                        <v-autocomplete label="Escriba la institución procesa la muestra" v-model="form.rep_id"
                            append-icon="mdi-arrow-down-drop-circle-outline" :items="reps" item-value="id"
                            item-text="nombre" @input="preCargarInformacion($event)" :search-input.sync="rep" dense
                            :rules="camposRequeridos" clearable required>
                        </v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="2" sm="3">
                        <v-autocomplete dense label="Tipo de documento" :items="tiposDocumentos" :loading="loading"
                            no-data-text="No hay resultados" item-value="id" item-text="nombre"
                            v-model="form.tipo_documento" />
                    </v-col>

                    <v-col cols="12" md="2" sm="3">
                        <v-text-field label="Digita el documento" v-model="form.cedula_paciente"
                            append-icon="mdi-account-search" dense :rules="camposRequeridos" clearable
                            @click:clear="limpiarComponente()" @keyup.enter="buscar_afiliado()">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" sm="4">
                        <v-card-actions>
                            <v-btn color="warning" small @click="limpiarComponente()">Limpiar</v-btn>
                            <v-btn color="success" small @click="buscar_afiliado()">Buscar</v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card-text>
            <!-- FORMULARIO CON LOS DATOS PRINCIPALES DEL USUARIO -->
            <div :loading="loading" :disabled="loading">
                <component :is="comp" :afiliado="datos" :modoDetalle="true" :modoEdicion="true"
                    :mostrarClasificaciones="true" @respuestaComponente="limpiarComponente()" />
            </div>

            <!-- SI SELECCIONA TOMA DE MUESTRA DEBE MOSTRAR EL SIGUIENTE FORMULARIO -->
            <v-col cols="12" sm="12" md="12" v-if="form.tipo_radicacion === 'TOMA DE MUESTRA'">
                <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                    <b>TOMA DE MUESTRA</b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="form.tipo_radicacion === 'TOMA DE MUESTRA'">
                <v-row>
                    <v-col cols="12" md="3" sm="4">
                        <v-text-field label="Correo" v-model="form.correo" :rules="emailRules" append-icon="mdi-gmail"
                            dense clearable required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="4">
                        <v-text-field label="Celular" v-model="form.celular" append-icon="mdi-cellphone-basic"
                            :rules="camposRequeridos" dense clearable required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="4">
                        <v-text-field label="Dirección" v-model="form.direccion" append-icon="mdi-road" dense clearable
                            :rules="camposRequeridos">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="4">
                        <v-text-field label="Télefono fijo" v-model="form.telefono_fijo" :rules="camposRequeridos"
                            append-icon="mdi-deskphone" dense clearable required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" sm="2">
                        <v-text-field label="Fecha procedimiento" v-model="form.fecha_procedimiento" dense
                            :rules="camposRequeridos" clearable type="date" required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-autocomplete label="Órgano" v-model="form.organo_id" :items="organos" item-text="nombre"
                            item-value="id" :rules="camposRequeridos" append-icon="mdi-human" dense clearable required>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-file-input counter show-size truncate-length="10" v-model="adjuntos" small-chips multiple
                            outlined dense label="Adjuntar" accept=".jpg, .jpeg, .pdf">
                        </v-file-input>
                    </v-col>
                </v-row>
            </v-col>

            <!-- SI SELECCIONA CARGA DE RESULTADOS DEBE MOSTRAR EL SIGUIENTE FORMULARIO -->
            <v-col cols="12" sm="12" md="12" v-if="form.tipo_radicacion === 'CARGA DE RESULTADOS'">
                <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                    <b>CARGA DE RESULTADOS</b>
                </v-alert>
                <v-col cols="12" sm="12" md="12" v-if="form.tipo_radicacion === 'CARGA DE RESULTADOS'">
                    <v-row>
                        <v-col cols="12" md="2" sm="4">
                            <v-text-field label="Fecha ingreso de la muestra" v-model="form.fecha_ingreso_muestra"
                                :rules="camposRequeridos" dense clearable type="date" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" sm="4">
                            <v-text-field label="Fecha salida de la muestra" v-model="form.fecha_salida_muestra"
                                :rules="camposRequeridos" dense clearable type="date" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="8" sm="4">
                            <v-autocomplete dense v-model="form.cie10_id" :rules="camposRequeridos" :items="cie10"
                                :item-text="concatenarCie10" item-value="id"
                                append-icon="mdi-arrow-down-drop-circle-outline" label="Diagnóstico*">
                            </v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="2" sm="4">
                            <v-autocomplete :items="sistemas" label="Sistema" v-model="form.sistema"
                                :rules="camposRequeridos" append-icon="mdi-arrow-down-drop-circle-outline" dense
                                clearable required>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="2" sm="4">
                            <v-autocomplete label="Órgano" v-model="form.organo_id" :items="organos" item-text="nombre"
                                item-value="id" :rules="camposRequeridos" append-icon="mdi-human" dense clearable
                                required>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="2" sm="4">
                            <v-autocomplete :items="gradosDiferenciacion" label="Grado diferenciacion"
                                v-model="form.grado_infiltracion" :rules="camposRequeridos"
                                append-icon="mdi-arrow-down-drop-circle-outline" dense clearable required>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="2" sm="3">
                            <v-autocomplete :items="gradosHistologicos" label="Grado histólogico"
                                v-model="form.grado_histologico" :rules="camposRequeridos"
                                append-icon="mdi-arrow-down-drop-circle-outline" dense clearable required>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3" sm="3">
                            <v-autocomplete :items="clasificacionesMuestra" label="Clasificación de la muestra"
                                v-model="form.clasificacion_muestra" append-icon="mdi-arrow-down-drop-circle-outline"
                                dense clearable required>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3" sm="4">
                            <v-file-input counter show-size truncate-length="10" v-model="adjuntos" small-chips multiple
                                outlined dense label="Adjuntar" accept=".jpg, .jpeg, .pdf">
                            </v-file-input>
                        </v-col>
                    </v-row>
                </v-col>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="form.tipo_radicacion != ''">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="registrarMuestra()">
                        <v-icon left>
                            mdi-content-save
                        </v-icon>
                        Registrar toma de muestra
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-card>
        <template>
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
        </template>
    </div>
</template>

<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    name: 'FrontHorusCargaProcedimientos',
    components: {
        AfiliadoComponent,
    },
    data() {
        return {
            tiposDocumentos: [],
            adjuntos: [],
            cie10: [],
            organos: [],
            loading: false,
            comp: null,
            preload: false,
            form: {
                tipo_documento: '',
                cedula_paciente: '',
                tipo_radicacion: '',
                rep_id: '',
                correo: '',
                celular: '',
                direccion: '',
                telefono_fijo: '',
                fecha_procedimiento: '',
                organo_id: '',
                fecha_ingreso_muestra: '',
                fecha_salida_muestra: '',
                cie10_id: '',
                grado_infiltracion: '',
                grado_histologico: '',
                clasificacion_muestra: '',
                biopsia: '',
                sistema: null,
            },
            tipoRadicacion: ['TOMA DE MUESTRA', 'CARGA DE RESULTADOS'],
            gradoInfiltracion: [],
            gradoHistologico: [],
            clasificacionMuestra: [],
            biopsia: [],
            datos: {},
            reps: null,
            rep: null,
            emailRules: [
                v => !!v || 'El correo es requerido',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            camposRequeridos: [
                v => !!v || 'El campo es requerido *'
            ],
            clasificacionesMuestra: [
                'Patología básica',
                'Inmunohistoquímica',
                'Citometría de flujo',
                'Genética',
                'Medula Osea',
                'Clínica exclusivamente (incluye estudios imagenológicos y/o de laboratorio en aquellos casos clínicamente justificados en donde fue imposible tomar muestra de estudio histopatológico)',
                'Desconocido, el dato de esta variable no se encuentra descrito en los soportes clínicos.',
                'Reporte Biopsia POP',
                'Reporte Biopsia Pcte Hospitalizado'
            ],
            gradosDiferenciacion: [
                'Bien diferenciado (grado 1)',
                'Moderadamente diferenciado (grado 2)',
                'Mal diferenciado (grado 3)',
                'Anaplásico o indiferenciado (grado 4)',
                'Es un cáncer sólido cuyo reporte de patología no incluye la descripción de la diferenciación celular. (ejemplo: cáncer de tiroides, carcinoma basocelular, tumores in situ, melanoma, próstata, entre otros).',
                'No es sólido (cáncer hematolinfático)'
            ],
            gradosHistologicos: [
                'Adenocarcinoma, con o sin otra especificación',
                'Carcinoma escamocelular (epidermoide), con o sin otra especificación',
                'Carcinoma de células basales (basocelular)',
                'Carcinoma, con o sin otra especificación diferentes a las anteriores',
                'Oligodendroglioma, con o sin otra especificación',
                'Astrocitoma, con o sin otra especificación',
                'Ependimoma, con o sin otra especificación',
                'Neuroblastoma, con o sin otra especificación',
                'Meduloblastoma, con o sin otra especificación',
                'Hepatoblastoma, con o sin otra especificación',
                'Rabdomiosarcoma, con o sin otra especificación',
                'Leiomiosarcoma, con o sin otra especificación',
                'Osteosarcoma, con o sin otra especificación',
                'Fibrosarcoma, con o sin otra especificación',
                'Angiosarcoma, con o sin otra especificación',
                'Condrosarcoma, con o sin otra especificación',
                'Otros sarcomas, con o sin otra especificación',
                'Pancreatoblastoma, con o sin otra especificación',
                'Blastoma pleuropulmonar, con o sin otra especificación',
                'Otros tipos histológicos no mencionados',
                'Melanoma',
                'Carcinoma papilar de tiroides'
            ],
            biopsias: [
                'Patologia de Organo Solido',
                'Inmunohistoquimica',
                'Citometria de Flujo'
            ],
            sistemas: [
                'Reproductivo',
                'Cardiovascular',
                'Digestivo',
                'Gastrointestinal',
                'Tejidos Blandos',
                'Nervioso Central',
                'Osteoarticular',
                'Ocular',
                'Óseo',
                'Hematolinfoide',
                'Endocrino',
                'Hepatobiliar',
                'Respiratorio',
                'Urinario',
                'Hematopoyético',
                'Tegumentario',
                'Genitourinario',
                'Circulatorio',
                'Osteomuscular',
                'Piel y Tejidos Blandos',
                'Oral',
                'Otros Sistemas',
                'Auditivo',
                'Hepático',
                'Linfático',
                'Autopsia'
            ],

        };
    },
    mounted() {
        this.listarCie10();
        this.listarOrganos();
        this.listarTiposDocumentos();
    },

    watch: {
        rep(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarReps();
                } else if (val.length < 4) {
                    this.reps = null;
                }
            } else {
                this.reps = null;
            }
        }
    },

    methods: {
        registrarMuestra() {
            if (this.adjuntos.length < 1) {
                this.$swal({
                    title: '!No puede ser!',
                    text: "Debe adjuntar como mínimo un archivo",
                    type: 'error',
                })
            } else {
                const formData = new FormData();
                formData.append(`cedula_paciente`, this.form.cedula_paciente);
                formData.append(`tipo_radicacion`, this.form.tipo_radicacion);
                formData.append(`rep_id`, this.form.rep_id);
                formData.append(`correo`, this.form.correo);
                formData.append(`celular`, this.form.celular);
                formData.append(`direccion`, this.form.direccion);
                formData.append(`telefono_fijo`, this.form.telefono_fijo);
                formData.append(`fecha_procedimiento`, this.form.fecha_procedimiento);
                formData.append(`organo_id`, this.form.organo_id);
                formData.append(`fecha_ingreso_muestra`, this.form.fecha_ingreso_muestra);
                formData.append(`fecha_salida_muestra`, this.form.fecha_salida_muestra);
                formData.append(`cie10_id`, this.form.cie10_id);
                formData.append(`grado_infiltracion`, this.form.grado_infiltracion);
                formData.append(`grado_histologico`, this.form.grado_histologico);
                formData.append(`clasificacion_muestra`, this.form.clasificacion_muestra);
                formData.append(`biopsia`, this.form.biopsia);
                formData.append('sistema', this.form.sistema);
                for (let i = 0; i < this.adjuntos.length; i++) {
                    formData.append(`adjuntos[]`, this.adjuntos[i]);
                }
                this.$axios.post('/toma-procedimiento/crear', formData).then(res => {
                    this.$toast.success(res.data.mensaje)
                    this.limpiarComponente();

                }).catch(error => {
                    console.log(error);
                })
            }
        },

        listarOrganos() {
            this.$axios.get('/organos/listar').then(res => {
                this.organos = res.data;
            }).catch(error => {
                console.log(error);
            })
        },

        listarReps() {
            this.preload = true;
            this.$axios.post('reps/listarConfiltro?page=0', {
                rep: this.rep
            }).then(res => {
                if (res.data.length >= 2) {
                    this.preload = false;
                    this.reps = res.data;
                } else if (res.data.length == 1) {
                    this.preload = false;
                    this.filtro.prestador_id = res.data[0].prestador_id
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre}` - `${rep.codigo_habilitacion_completo}`,
                        }
                    })
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => this.preload = false)
        },

        listarCie10() {
            this.$axios.get('/cie10/listar').then(res => {
                this.cie10 = res.data
            }).catch(error => {
                console.log(error)
            })
        },

        concatenarCie10(listarCie10) {
            return `${listarCie10.codigo_cie10} - ${listarCie10.nombre}`;
        },

        limpiarComponente() {
            this.comp = null;
            this.crear = false;
            this.datos = {};
            this.adjuntos = [];
            for (const key in this.form) {
                this.form[key] = ''
            }
        },

        limpiarFormulario() {
            this.comp = null;
            this.form.rep_id = '';
            this.form.cedula_paciente = '';
            this.form.correo = '';
            this.form.celular = '';
            this.form.direccion = '';
            this.form.telefono_fijo = '';
            this.form.fecha_procedimiento = '';
            this.form.organo_id = '';
            this.form.fecha_ingreso_muestra = '';
            this.form.fecha_salida_muestra = '';
            this.form.cie10_id = '';
            this.form.grado_infiltracion = '';
            this.form.grado_histologico = '';
            this.form.clasificacion_muestra = '';
            this.form.biopsia = '';
        },

        buscar_afiliado() {
            if (this.form.cedula_paciente.length <= 0) {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Debe ingresar el número de documento de un afiliado para realizar la búsqueda",
                    type: "warning",
                });
            }
            if (!this.form.tipo_documento) {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Debe ingresar el tipo de documento de un afiliado para realizar la búsqueda",
                    type: "warning",
                });
            }
            this.preload = true
            this.$axios.get('/afiliados/' + this.form.cedula_paciente + '/' + this.form.tipo_documento).then((res) => {
                this.comp = "AfiliadoComponent";
                this.datos = res.data;
                this.preload = false;
            })
                .catch((e) => {
                    this.preload = false;
                    this.$toast.error(e.response.data.error);
                });
        },
        listarTiposDocumentos() {
            this.loading = true;
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
                    this.loading = false;
                });
        },
        preCargarInformacion(item) {
            const obj = this.reps.find((rep) => parseInt(rep.id) === parseInt(item));
            this.form.correo = obj.correo1
            this.form.telefono_fijo = obj.telefono1
            this.form.celular = obj.telefono2
            this.form.direccion = obj.direccion
        },
    },
};

</script>

<style lang="scss" scoped></style>
