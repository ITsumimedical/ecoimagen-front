<template>
    <div>
        <v-card>
            <v-alert dense text color="blue" class="text-center">
                <b>Oxigeno</b></v-alert>
            <v-divider></v-divider>
            <v-card-title v-if="crear">
                <v-toolbar flat>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="success" small class="mb-2 white--text" @click="abrirModalCrear()">
                        Crear
                        <v-icon dark right>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="headers" :items="signosVitales"
                    no-data-text="No hay datos visibles para mostrar" dense hide-default-footer disable-pagination>
                    <template v-slot:[`item.fecha`]="{ item }">
                        {{ $moment(item.fecha).format("YYYY-MM-DD ") }}
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <div class="text-center">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                            @click="abrirModalEditar(item)">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon color="green" v-on="on"
                                        @click="imprimir(item)">
                                        <v-icon>mdi-file-download</v-icon>
                                    </v-btn>
                                </template>
                                <span>Imprimir orden</span>
                            </v-tooltip>
                        </div>
                    </template>
                    <template v-slot:[`item.enfermero`]="{ item }">
                        <p>{{item.usuario.operador.nombre}} {{item.usuario.operador.apellido}}</p>
                    </template>
                    <!--

                    <template v-slot:[`item.hora`]="{ item }">
                        {{ $moment(item.fecha).format("HH:mm:ss") }}
                    </template> -->

                </v-data-table>
            </v-card-text>


            <v-dialog v-model="dialogCrearEditar" persistent max-width="900px">
                <v-card>
                    <v-alert dense text border="left" icon="mdi-file-edit-outline" type="info" color="info">
                        <b>{{ editMode ? "Editar" : "Crear" }} Oxigeno</b>
                    </v-alert>
                    <v-card-text>
                        <v-form ref="camaForm">
                            <v-row dense>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field type="date" v-model="form.fecha" outlined label="Fecha"
                                        :rules="rules.fecha">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="4">
                                    <v-menu ref="fechaInicial" v-model="menu1" :close-on-content-click="false"
                                        :nudge-right="40" :return-value.sync="form.hora_inicio"
                                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field dense v-model="form.hora_inicio" label="Hora inicio"
                                                prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
                                                v-on="on" required outlined>
                                            </v-text-field>
                                        </template>
                                        <v-time-picker format="24hr" v-if="menu1" v-model="form.hora_inicio" full-width
                                            @click:minute="$refs.fechaInicial.save(form.hora_inicio)">
                                        </v-time-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="4" md="4">
                                    <v-menu ref="horaFinal" v-model="menu2" :close-on-content-click="false"
                                        :nudge-right="40" :return-value.sync="form.hora_final"
                                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field dense v-model="form.hora_final" label="Hora final"
                                                prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
                                                v-on="on" outlined>
                                            </v-text-field>
                                        </template>
                                        <v-time-picker format="24hr" v-if="menu2" v-model="form.hora_final" full-width
                                            @click:minute="$refs.horaFinal.save(form.hora_final)">
                                        </v-time-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.flujo" outlined label="Flujo"
                                        :rules="rules.flujo">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.flo2" outlined label="FlO2 (%)">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.total_litros" outlined label="Total litros"
                                        :rules="rules.total_litros">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="4">
                                    <v-text-field dense v-model="form.total_horas" label="Total de horas"
                                         readonly outlined>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">

                                </v-col>

                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete :items="administracion" v-model="form.modo_administracion"
                                         label="Modo administracion" outlined
                                         :rules="rules.modo_administracion"></v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="red" dark @click="dialogCrearEditar=false">Cerrar</v-btn>
                        <v-btn small color="success" dark @click="guardarOxigeno()">
                            {{ editMode ? "Guardar Cambios" : "Crear" }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";

    export default {
        props: {
            ejecutar: {
                type: Boolean,
                default: false,
            },
            datos: Object,
            crear: Boolean
        },
        name: 'triage',
        data() {
            return {
                menu2: false,
                menu1: false,
                campoBusqueda: '',
                preload: false,
                totalHoras: "",
                headers: [{
                        text: 'Id',
                        value: 'id'
                    },
                    {
                        text: 'Fecha',
                        value: 'fecha'
                    },
                    {
                        text: 'Hora inicio',
                        value: 'hora_inicio'
                    },
                    {
                        text: 'Hora finalizacion',
                        value: 'hora_final'
                    },
                    {
                        text: 'Flujo',
                        value: 'flujo'
                    },
                    {
                        text: 'FLO2',
                        value: 'flo2'
                    },
                    {
                        text: 'Total litros',
                        value: 'total_litros'
                    },
                    {
                        text: 'Total horas',
                        value: 'total_horas'
                    },
                    {
                        text: 'Modo administracion',
                        value: 'modo_administracion'
                    },
                    {
                        text: 'Usuario(a)',
                        value: 'enfermero'
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones'
                    },
                ],
                administracion:['Cateter o canula nasal','Ventury 24%, 28%','Ventury 31%, 35%','Ventury 40%, 50%','Ventury A + 50%',
                'Mascarar reservorio','Mascara traqueostomia','Camara de Hood','Ventilador mecanico','Ventilador mecanico no invasivo',
                'Tubo en T','CPAP','Ventilacion de alta frecuencia','O2 por incubadora'
                ],
                rules: {
                    fecha: [(v) => !!v || "El campo fecha es requerido"],
                    hora_inicio: [(v) => !!v || "El campo hora inicio es requerido"],
                    hora_final: [(v) => !!v || "El campo hora terminacion es requerido"],
                    flujo: [(v) => !!v || "El campo flujo es requerido"],
                    total_litros: [(v) => !!v || "El campo total litros es requerido"],
                    modo_administracion: [(v) => !!v || "El campo modo administracion es requerido"],
                },
                dialogCrearEditar: false,
                signosVitales: [],
                editMode: false,
                form: {
                    fecha: this.$moment().format("YYYY-MM-DD")
                }
            }
        },
        mounted() {
            this.listarOxigeno()
        },

        watch: {
            "form.hora_inicio": "calcularTotalHoras",
            "form.hora_final": "calcularTotalHoras"
        },

        methods: {
            ...mapActions('app', ['setPreload']),


            async listarOxigeno() {
                try {
                    this.setPreload(true)
                    const response = await this.$axios.post(`/oxigeno/listarOxigeno`, {
                        admision_urgencia_id: this.datos.admision_urgencia_id
                    })
                    this.signosVitales = response.data;
                } catch (error) {
                    console.log(error)
                } finally {
                    this.setPreload(false)
                }
            },

            abrirModalCrear() {
                this.dialogCrearEditar = true;
                this.editMode = false;
            },


            cancelarCrearEditar() {
                this.dialogCrearEditar = false;
                this.form = {
                    fecha:this.$moment().format("YYYY-MM-DD"),
                    hora_inicio:'',
                    hora_final:'',
                    flujo:'',
                    flo2:'',
                    total_litros:'',
                    total_horas:'',
                    modo_administracion:'',
                    admision_urgencia_id:''
                }
            },

            guardarOxigeno() {
                if (!this.$refs.camaForm.validate()) {
                    return
                }
                if (this.editMode) {
                    this.setPreload(true)
                    this.$axios
                    .put(`/oxigeno/${this.form.id}`, this.form)
                    .then((res) => {
                        this.cancelarCrearEditar();
                        this.$toast.success("Se creó el resgistro correctamente");
                        this.listarOxigeno();
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al actualizar ");
                        console.log(error);
                    })
                    .finally(() => {
                        this.setPreload(false)
                    });
                } else {
                    this.setPreload(true)
                    this.form.admision_urgencia_id = this.datos.admision_urgencia_id
                    this.$axios.post(`/oxigeno/crear`, this.form)
                    .then((res) => {
                        this.cancelarCrearEditar();
                        this.$toast.success("Se creó el resgistro correctamente");
                        this.listarOxigeno();
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al crear ");
                        console.log(error);
                    })
                    .finally(() => {
                        this.setPreload(false)
                    });
                }
            },


            calcularTotalHoras() {
                if (this.form.hora_inicio && this.form.hora_final) {
                    const [h1, m1] = this.form.hora_inicio.split(":").map(Number);
                    const [h2, m2] = this.form.hora_final.split(":").map(Number);

                    const inicio = new Date();
                    const fin = new Date();
                    inicio.setHours(h1, m1, 0);
                    fin.setHours(h2, m2, 0);

                    let diferenciaMinutos = (fin - inicio) / 60000; // Convertimos a minutos

                    if (diferenciaMinutos < 0) {
                        diferenciaMinutos += 1440; // Si la hora final es menor, es del día siguiente
                    }

                    const horasDecimal = (diferenciaMinutos / 60).toFixed(2); // Convertimos a horas

                    this.form.total_horas = horasDecimal;
                } else {
                    this.form.total_horas = "";
                }
            },

            abrirModalEditar(item) {
                this.dialogCrearEditar = true;
                this.editMode = true;
                this.form = {
                    ...item
                };
            },

            async imprimir(item) {
                const request = {
                    id: item.id,
                    tipo: 'oxigenoUrgencias',
                }
                this.setPreload(true);
                try {
                    const res = await this.$axios.post('/pdf', request, { responseType: 'arraybuffer' });
                    const blob = new Blob([res.data], {
                    type: "application/pdf"
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                    link.remove(link);
                } catch (error) {
                    this.$toast.error('Error al imprimir la nota aclaratoria');
                    console.error(error);
                } finally {
                    this.setPreload(false);
                }
            },

        }
    }

</script>
