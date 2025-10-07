<template>
    <div>
        <!-- Preload -->
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

        <v-card elevation="0">
            <v-container fluid>
                <v-row dense>
                    <!-- Form -->
                    <v-col cols="12" md="12" sm="12">
                        <v-alert class="text-center" dense text border="left" type="info" icon="mdi-account-arrow-left">
                            <b>ANTECEDENTES PERSONALES</b></v-alert>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete :items="cie10s" :loading="loading" label="Patología"
                            v-model="antecedentesPersonales.patologias" dense outlined solo item-text="Codigo_Nombre"
                            :search-input.sync="cie10" no-data-text="Por favor escriba el nombre del diagnostico"
                            item-value="Codigo_Nombre" v-if="antecedentesPersonales.patologias != 'No tiene'">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Cancer'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="tipoCancer"
                            label="Tipo">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Asma'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="tipoAsma"
                            label="Tipo">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Epoc'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="tipoEpo"
                            label="Tipo">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Bronquitis Cronica'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="tipoEpo"
                            label="Tipo">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Tuberculosis'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="tipoTuberculosis"
                            label="Tipo">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Diabetes'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="tipoDiabetes"
                            label="Tipo">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3"
                        v-if="antecedentesPersonales.patologias == 'Enfermedad Renal Cronica'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="tipoRenal"
                            label="Tipo">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Trastorno Mental'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="tipotrastorno"
                            label="Tipo trastorno">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Malnutricion'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="malNutricion"
                            label="Tipo Malnutricion">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="antecedentesPersonales.patologias == 'Enfermedad Tiroidea'">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="enfermedadTiroidea"
                            label="Tipo Enfermedad Tiroidea">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="
                        antecedentesPersonales.patologias == 'Enfermedades Trasmision Sexual'
                    ">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo"
                            :items="tipoEnfermedadSexual" label="Tipo trasmision sexual">
                        </v-select>
                    </v-col>
                    <!-- fecha -->
                    <v-col cols="12" sm="6" md="2" v-if="antecedentesPersonales.patologias != 'No tiene'">
                        <v-text-field type="date" v-model="antecedentesPersonales.fecha_diagnostico" label="Regular"
                            dense outlined :max="hoy" solo></v-text-field>
                    </v-col>

                    <v-col>
                        <v-tooltip bottom v-if="antecedentesPersonales.patologias != 'No tiene'">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="success" small outlined fab v-bind="attrs" v-on="on" @click="guardar()">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <span>Agregar antecedente personal</span>
                        </v-tooltip>
                    </v-col>

                    <!-- Campos de textarea -->
                    <v-col cols="12" sm="6" md="3" v-if="
                        antecedentesPersonales.patologias ==
                        'Otras Enfermedades Autoinmunes diferente a Artritis Reumatoidea'
                    ">
                        <v-select dense outlined solo v-model="antecedentesPersonales.tipo" :items="autoinmunes"
                            label="Tipo enfermedad autoinmune">
                        </v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="12" v-if="
                        antecedentesPersonales.patologias == 'Cancer' &&
                        antecedentesPersonales.tipo == 'Otro cancer'
                    ">
                        <v-textarea name="input-7-1" dense outlined v-model="antecedentesPersonales.otras"
                            label="Otra Cancer">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-if="antecedentesPersonales.patologias == 'Discapacidad'">
                        <v-textarea name="input-7-1" dense outlined v-model="antecedentesPersonales.cual"
                            label="Cual discapacidad">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-if="
                        antecedentesPersonales.patologias ==
                        'Otras Enfermedades Autoinmunes diferente a Artritis Reumatoidea' &&
                        antecedentesPersonales.tipo == 'Otras Enfermedades Autoinmunes'
                    ">
                        <v-textarea name="input-7-1" dense outlined v-model="antecedentesPersonales.otras"
                            label="Otra enfermedad autoinmune">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-if="
                        antecedentesPersonales.patologias == 'Enfermedades Trasmision Sexual' &&
                        antecedentesPersonales.tipo == 'Otra enfermedad Sexual'
                    ">
                        <v-textarea name="input-7-1" dense outlined v-model="antecedentesPersonales.otras"
                            label="Otra enfermedad sexual">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-if="antecedentesPersonales.patologias == 'Otro patologia'">
                        <v-textarea name="input-7-1" dense outlined v-model="antecedentesPersonales.otras"
                            label="Otra patologia">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-if="
                        antecedentesPersonales.patologias ==
                        'Enfermedad Genética o Congenita Multiple'
                    ">
                        <v-textarea name="input-7-1" dense outlined v-model="antecedentesPersonales.cual" label="Cual">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-if="
                        antecedentesPersonales.patologias == 'Otras Enfermedades Neurologicas'
                    ">
                        <v-textarea name="input-7-1" dense outlined v-model="antecedentesPersonales.descripcion"
                            label="Descripcion">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-if="
                        antecedentesPersonales.patologias == 'Enfermedad o Accidente Laboral'
                    ">
                        <v-textarea name="input-7-1" dense outlined v-model="antecedentesPersonales.descripcion"
                            label="Descripcion">
                        </v-textarea>
                    </v-col>

                    <!-- Marcar como que no posee antecedentes -->
                    <v-col cols="12" md="12" sm="12" v-if="!antecedentes || antecedentes.length === 0">
                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="blue-grey" class="text-center"
                                icon="mdi-checkbox-marked-circle-plus-outline" border="left">
                                <b>No posee antecedentes personales</b>
                            </v-alert>
                        </v-col>
                        <v-row align="center">
                            <v-col cols="auto">
                                <v-checkbox v-model="antecedentesPersonales.patologias" value="No tiene"
                                    label="Marcar en caso de que no posea antecedentes personales">
                                </v-checkbox>
                            </v-col>

                            <v-col cols="auto">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="success" small outlined fab v-bind="attrs" v-on="on"
                                            @click="guardar()">
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Añadir</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-col>


                    <v-col cols="12" sm="12" md="12" class="mt-2">
                        <v-alert dense text border="left" type="info" icon="mdi-history" color="blue-grey"
                            class="text-center">
                            <b>Histórico de antecedentes personales</b>
                        </v-alert>
                        <v-data-table :headers="headersHistorico" :items="antecedentes" :loading="loading" dense
                            class="elevation-1 mt-4" no-data-text="Sin datos para mostrar">
                            <template v-slot:[`item.tipo`]="{ item }">
                                {{ item.tipo ? item.tipo : "No aplica" }}
                            </template>
                            <template v-slot:[`item.user.operador`]="{ item }">
                                {{ `${item.user?.operador?.nombre || ''} ${item.user?.operador?.apellido || ''}`.trim()
                                || 'Sin nombre' }}
                            </template>
                            <template v-slot:[`item.descripcion`]="{ item }">
                                {{ item.descripcion ? item.descripcion : "No aplica" }}
                            </template>
                            <template v-slot:[`item.otras`]="{ item }">
                                {{ item.otras ? item.otras : "No aplica" }}
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }"
                                        v-if="item.medico_registra === $store.state.auth.usuario.id">
                                        <v-icon small color="warning" class="mr-2"
                                            @click="eliminarAntecedentePersonal(item)" v-bind="attrs" v-on="on">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "WorkspaceJsonAntecedentesPersonalesComponent",
    props: {
        datos: Object,
        ocupacional: Array,
        resumen: Object
    },
    created() {
        this.antecedentesPersonales.consulta_id = this.datos.id;
        if (this.ocupacional !== undefined) {
            this.antecedentesPersonales.consulta_id = this.ocupacional[0].id_CONSULTA
        }
    },
    data() {
        return {
            preload: false,
            loading: false,
            antecedentes: [],
            antecedentesPersonales: {
                patologias: null,
                fecha_diagnostico: null,
                tipo: null,
                cual: null,
                otras: null,
                descripcion: null,
                consulta_id: null,
                afiliado_id: null,
            },
            hoy: this.$moment().format("YYYY-MM-DD"),
            patologias: [
                "COVID",
                "Cardiopatia Isquemica",
                "Hipertension Arterial",
                "Enfermedad Cardiovascular",
                "Enfermedad Cerebrovascular",
                "Enfermedad Renal Cronica",
                "Diabetes",
                "Obesidad",
                "Asma",
                "Epoc",
                "Anemia",
                "Gastritis",
                "Enfermedad Tiroidea",
                "Dislipidemia",
                "Artritis reumatoide",
                "Enfermedades transmisión sexual",
                "Cancer",
                "VIH",
                "Tuberculosis",
                "Malnutricion",
                "Discapacidad",
                "Sindrome de Apnea Hipoapnea del sueño",
                "Enfermedad Tromboembolica",
                "Enfermedad Arterial Oclusiva Cronica",
                "Enfermedades Trasmision Sexual",
                "Otras Enfermedades Neurologicas",
                "Convulsiones/Epilepsia",
                "Bronquitis Cronica",
                "Enfermedades Musculoesqueleticas",
                "Enfermedad o Accidente Laboral",
                "Enfermedad Genetica",
                "Otras Enfermedades Autoinmunes diferente a Artritis Reumatoidea",
                "Dermatitis Atopica",
                "Anomalia congenita mayor o multiple",
                "Patologia Perinatal o Neonatal significativa",
                "Presenta algun evento de interes en Salud Publica",
                "Niños con sospecha de problemas del desarrollo infantil",
                "Familiar manifiesta alguna preocupacion referente a la salud, puericultura o cuidado extra-escolar",
                "Problemas visuales",
                "Alteraciones sensoriales",
                "Trastorno Mental",
                "Conducta Suicida",
                "Victima de Maltrato Fisico y/o Psicologico",
                "Victima Abuso/Violencia Sexual",
                "Victima de Conflicto Armado",
                "Hijo de madre con sospecha o diagnostico de depresion postparto",
                "Hijo de padres con consumo de sustancias psicoactivas",
                "Hijo de padres con enfermedad mental",
                "Niño acompañante de mujer en privacion de la libertad en centro carcelario",

            ],
            tipoCancer: [
                "Ca de Mama",
                "Ca de Prostata",
                "Ca Gastrico",
                "Ca de Colon",
                "Ca Hematopoyetico",
                "Ca de Cervix",
                "Ca de Cabeza y  Cuello",
                "Ca de Pancreas",
                "Ca de Hepatico",
                "Ca Renal",
                "Ca Oseo",
                "Piel",
                "Pene",
                "Otro cancer",
            ],
            tipoAsma: ["Bien controlado", "Parcialmente controlado", "No controlado"],
            tipoEpo: ["Leve", "Moderado", "Grave", "Muy grave"],
            tipoDiabetes: ["Tipo I", "Tipo II", "Gestacional"],
            tipoTuberculosis: ["Pulmonar", "Osea", "Meniengea", "Extrapulmonar"],
            tipoRenal: [
                "Estadio 1",
                "Estadio 2",
                "Estadio 3A",
                "Estadio 3B",
                "Estadio 4",
                "Estadio 5",
            ],
            tipotrastorno: [
                "Ansiedad",
                "Depresion",
                "Esquezofrenia",
                "Trastorno Afectivo Bipolar",
                "Deficit de Atencion por Hiperactividad",
                "Trastorno de la conducta alimentaria",
                "Trastorno de la Adaptacion",
                "Conducta Suicida",
            ],
            tipoEnfermedadSexual: [
                "Sifilis",
                "Blenorragia",
                "Condilomas",
                "VIH",
                "Hepatitis B",
                "Hepatitis C",
                "Otra enfermedad Sexual",
            ],
            malNutricion: ["Obesidad", "Desnutricion"],
            enfermedadTiroidea: [
                "Hipertiroidismo",
                "Hipotiroidismo",
                "Hipotiroidismo Congenito",
            ],
            autoinmunes: [
                "Lupus Eritematosos Sistemico (LES)",
                "Esclerosis",
                "Sjogren",
                "Espondilitis anquilosante",
                "Otras Enfermedades Autoinmunes",
            ],
            headers: [{
                text: "Patologias",
                value: "patologias",
            },
            {
                text: "Tipo (g)",
                value: "tipo",
            },
            {
                text: "Descripción",
                value: "descripcion",
            },
            {
                text: "Otras",
                value: "otras",
            },
            {
                text: "Fecha Diagnostico",
                value: "fecha_diagnostico",
            },
            {
                text: "Eliminar",
                value: "eliminar",
            },
            ],
            headersHistorico: [{
                text: "Patologias",
                value: "patologias",
            },
            {
                text: "Fecha Diagnostico",
                value: "fecha_diagnostico",
            },
            {
                text: 'Registrado por',
                value: 'user.operador',
            },
            {
                text: "Acciones",
                value: "acciones",
                sortable: false,
                align: "center",
            }
            ],
            cie10s: [],
            cie10: null
        };
    },

    watch: {
        cie10(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarCie10();
                } else if (val.length < 4) {
                    this.cie10s = [];
                }
            } else {
                this.cie10s = [];

            }
        }
    },
    mounted() {
        this.listar();
    },

    methods: {

        listarCie10() {
            const data = {
                valor: this.cie10,
                afiliado_id: this.datos.afiliado.id
            }
            this.loading = true
            this.$axios.$post('cie10/listarFiltro', data).then(res => {
                this.cie10s = res
            }).catch(err => {
                console.log(err)
                this.$toast.error(err.response.data.mensaje)
            }).finally(() => {
                this.loading = false
            })
        },

        // Funcion para guardar el antecedente personal
        guardar() {
            if (this.antecedentesPersonales.patologias == "") {
                return this.$toast.error("Debe seleccionar una patología");
            }
            this.antecedentesPersonales.consulta_id = this.datos.id;
            if (this.ocupacional !== undefined) {
                this.antecedentesPersonales.consulta_id = this.ocupacional[0].id_CONSULTA
            }
            this.antecedentesPersonales.afiliado_id = this.datos.afiliado.id
            this.preload = true
            this.$axios.post("/antecedentes-personales/guardar-antecedentes-personales", this.antecedentesPersonales)
                .then((res) => {
                    this.$toast.success(res.data.mensaje);
                    this.limpiarFiltro();
                })
                .catch((e) => {
                    return this.$toast.error("Esta patología ya ha sido registrada");
                }).finally(() => {
                    this.preload = false
                })
        },
        listar() {
            let data = {}
            data.afiliado = this.datos.afiliado_id;
            if (this.ocupacional !== undefined) {
                data.afiliado = this.ocupacional[0].afiliado_id
            }
            this.loading = true
            this.$axios
                .post("/antecedentes-personales/listar", {
                    afiliado: data.afiliado
                })
                .then((res) => {
                    this.antecedentes = res.data;
                })
                .catch((err) => {
                    return this.$toast.error("Error al listar antecedentes personales");
                }).finally(() => {
                    this.loading = false
                })
        },
        limpiarFiltro() {
            for (const prop of Object.getOwnPropertyNames(
                this.antecedentesPersonales
            )) {
                this.antecedentesPersonales[prop] = null;
            }
            this.listar();
        },
        validarErrores() {
            return [];
        },

        eliminarAntecedentePersonal(item) {

            this.$swal({
                title: "¿Estas seguro de eliminar este antecedente?",
                text: `Está a punto de eliminar el antecedente ${item.patologias}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar!",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.preload = true
                    this.$axios.delete(`/antecedentes-personales/eliminar/${item.id}`).then((res) => {
                        this.$toast.success(res.data.mensaje);
                        this.listar();
                    }).catch((err) => {
                        return this.$toast.error("Error al eliminar antecedente personal");
                    }).finally(() => {
                        this.preload = false
                    })
                }
            })
        }
    },
};

</script>

<style lang="scss" scoped></style>
