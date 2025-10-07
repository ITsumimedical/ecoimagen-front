<template>
    <div>
        <!-- buscar afiliado -->
        <v-card>
            <v-alert dense text icon="mdi-account" border="left" color="blue"> Buscar Afiliado </v-alert>
            <v-container>
                <v-row>
                    <v-col>
                        <buscar-afiliado :documentos="documentos" @buscarAfiliado="realizarBusqueda"
                            ref="buscarAfiliado"></buscar-afiliado>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>

        <!-- datos del paciente -->
        <v-card v-if="EditarAfiliadoComponente">
            <v-card-text>
                <component :is="componente" :afiliado="datos" :modoDetalle="true" :modoEdicion="true"
                    :mostrarClasificaciones="true" />
            </v-card-text>
            <!-- Generar Anexo -->
            <v-alert dense text outlined color="blue" class="text-center">
                <strong>Generar Anexo</strong>
            </v-alert>

            <!-- formulario -->
            <v-container fluid>
                <!-- escoger el anexo -->
                <v-col cols="12" sm="12" md="12">
                    <v-row justify="center">
                        <v-radio-group v-model="data.tipo_anexo" mandatory>
                            <v-radio label="Informe de la atención de urgencias"
                                value="Informe de la atención de urgencias"></v-radio>
                            <v-radio label="Solicitud de autorización de servicios y tecnologías en salud"
                                value="Solicitud de autorización de servicios y tecnologías en salud"></v-radio>
                            <v-radio label="Referencia" value="Referencia"></v-radio>
                            <v-radio label="Contrarreferencia" value="Contrarreferencia"></v-radio>

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

                    <!-- Generar remision a domiciliaria -->
                    <v-alert dense text outlined color="blue" v-if="checkbox1 == true">
                        Información de la vivienda
                    </v-alert>

                    <form v-if="checkbox1 == true">
                        <v-row>
                            <v-col cols="12" sm="12" md="3">
                                <span>¿La vivienda tiene fácil acceso vehicular?</span>
                                <v-autocomplete :items="['Si', 'No']" v-model="domiciliaria.acceso_vehicular"
                                    dense></v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="12" md="4">
                                <span>La vivienda cuenta con:</span>
                                <v-autocomplete v-model="domiciliaria.vivienda_cuenta" :items="[
                                    'Nevera',
                                    'Telefonia Fija',
                                    'Telefonia Movil',
                                    'Acueducto',
                                    'Alcantarillado',
                                    'Energia',
                                    'Lavamanos',
                                    'Baño',
                                ]" dense chips small-chips multiple required></v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="12" md="2">
                                <span>¿Tipo de piso?</span>
                                <v-autocomplete v-model="domiciliaria.tipo_piso" :items="['Baldosa', 'Cemento', 'Otro']"
                                    dense>
                                </v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="12" md="3" v-if="domiciliaria.tipo_piso == 'Otro'">
                                <span>¿Cual?</span>
                                <v-textarea v-model="domiciliaria.piso_otro" dense auto-grow rows="1">
                                </v-textarea>
                            </v-col>

                            <v-col cols="12" sm="12" md="2">
                                <span>¿Presencia de animales?</span>
                                <v-autocomplete v-model="domiciliaria.presencia_animales" :items="['Si', 'No']"
                                    dense></v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="12" md="3" v-if="domiciliaria.presencia_animales == 'Si'">
                                <span>¿Cual?</span>

                                <v-textarea rows="1" auto-grow v-model="domiciliaria.animal_cual" dense></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="3">
                                <span>Método de cocción de alimentos:</span>
                                <v-autocomplete v-model="domiciliaria.coccion_alimentos"
                                    :items="['Energia', 'Gas', 'Leña']" dense>
                                </v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="12" md="4">
                                <span>Dirección de atención</span>
                                <v-text-field v-model="domiciliaria.direccion_atencion"
                                    hint="Si es la misma direccion registrada en el sistema, por favor dejalo vacio*"
                                    dense>
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" sm="12" md="3">
                                <span>¿Cuántas personas viven en la casa?</span>
                            </v-col>
                            <v-col cols="12" sm="12" md="1">
                                <v-text-field v-model="domiciliaria.viven_casa" type="number" dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="12" md="3">
                                <span>¿Cuántas habitaciones tiene la casa?</span>
                            </v-col>
                            <v-col cols="12" sm="12" md="1">
                                <v-text-field v-model="domiciliaria.cuantas_vive" type="number" dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="12" md="2">
                                <span>¿Cuenta con un cuidador?</span>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                                <v-autocomplete v-model="domiciliaria.cuidador" :items="['Si', 'No']"
                                    dense></v-autocomplete>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" sm="12" md="10">
                                <span>Cuenta con un área para el almacenamiento de residuos
                                    generados en la atención; al cual no tenga acceso mascotas ni
                                    niños y debe estar libre de humedad, lluvia o contacto directo
                                    con el sol.
                                </span>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                                <v-autocomplete :items="['Si', 'No']" v-model="domiciliaria.almacenamiento_residuos"
                                    dense>
                                </v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                                <span>Observaciones: </span>
                                <v-textarea rows="1" v-model="domiciliaria.observaciones_residuos" dense></v-textarea>
                            </v-col>

                            <v-col cols="12" sm="12" md="10">
                                <span>Cuenta con un espacio adecuado para el almacenamiento de
                                    insumos, medicamentos y dispositivos médicos (libre de luz
                                    directa del sol, humedad, no debe tener contacto directo con
                                    el piso, libre de plagas y alejado de menores de edad).
                                </span>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                                <v-autocomplete :items="['Si', 'No']" v-model="domiciliaria.almacenamiento_insumos"
                                    dense>
                                </v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                                <span>Observaciones: </span>
                                <v-textarea rows="1" v-model="domiciliaria.observaciones_insumos" dense></v-textarea>
                            </v-col>
                        </v-row>
                    </form>
                    <v-alert dense text outlined color="blue" v-if="checkbox1 == true">
                        Medidas y escalas
                    </v-alert>
                    <form v-if="checkbox1 == true">
                        <v-row>
                            <v-col cols="12" sm="12" md="2"></v-col>
                            <v-col cols="12" sm="12" md="2">
                                <span>Peso en KG</span>
                                <v-text-field v-model="domiciliaria.peso" type="number" dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="12" md="2">
                                <span>Talla en CM</span>
                                <v-text-field v-model="domiciliaria.talla" type="number" dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="12" md="2">
                                <span>Barthel</span>
                                <v-text-field v-model="domiciliaria.barthel" type="number" dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="12" md="2">
                                <span>Karnosky</span>
                                <v-text-field v-model="domiciliaria.karnosky" type="number" dense></v-text-field>
                            </v-col>
                        </v-row>
                    </form>

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
                    <v-btn color="error" @click="limpiarForms()">
                        Cancelar Remision
                    </v-btn>
                    <v-btn color="boton" @click="CrearReferencia()" dark>
                        Enviar Remision
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>


    </div>
</template>

<script>
import BuscarAfiliado from '@/components/afiliado/BuscarAfiliadoComponente.vue';
import {
    buscarAfiliado
} from "@/api/afiliados/afiliados";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import { mapActions } from 'vuex';

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("referencia.crear")) {
            return redirect("/");
        }
    },
    components: {
        BuscarAfiliado,
        EditarAfiliadoComponente
    },
    props: {
        documentos: Array
    },
    data: () => ({
        cedulaAfiliado: null,
        EditarAfiliadoComponente: false,
        checkbox1: false,
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

        ...mapActions('app', ['setPreload']),

        realizarBusqueda(cedula, tipoDocumento) {
            this.setPreload(true)
            this.$loadingGetRequest(buscarAfiliado(cedula, tipoDocumento)).then((res) => {
                this.componente = "EditarAfiliadoComponente";
                this.EditarAfiliadoComponente = true;
                this.datos = res.data;
                this.setPreload(false);
            }).catch(error => {
                this.limpiarForms()
                this.setPreload(false)
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
            this.$refs.buscarAfiliado.limpiarFormulario();
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
            // this.setPreload(true);
            const formData = new FormData();
            formData.append(`tipo_anexo`, this.data.tipo_anexo);
            formData.append(`especialidad_remision`, this.data.Especialidad_remi);
            formData.append(`afiliado_id`, this.datos.id);
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
            this.$axios
                .post("/referencias/crear", formData)
                .then((res) => {
                    this.setPreload(false)
                    this.$toast.success(res.data.mensaje);
                    this.limpiarForms();
                    this.listarCie10();
                })
                .catch((error) => {
                    this.setPreload(false)
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje);
                    } else if (error.response.data) { }
                });
        },
    },
};

</script>
