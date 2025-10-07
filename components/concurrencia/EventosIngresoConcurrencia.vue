<template>
    <div>
        <!-- Componente de evento para ingreso concurrencia -->
        <v-row dense>
            <v-col cols="6">
                <v-alert icon="mdi-alert-plus-outline" text color="blue-grey" dense border="left">Proceso registro de
                    evento
                </v-alert>
                <v-row dense>
                    <v-col cols="6" sm="6" md="6">
                        <v-autocomplete v-model="form.tipo_evento" label="Tipo de evento" dense
                            :items="['Centinela', 'Notificación inmediata', 'Seguridad']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-autocomplete v-model="form.evento" label="Evento" dense :items="eventos_centinelas"
                            v-if="form.tipo_evento == 'Centinela'">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-autocomplete v-model="form.evento" label="Evento" dense :items="eventos_notificacion"
                            v-if="form.tipo_evento == 'Notificación inmediata'">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-autocomplete v-model="form.evento" label="Evento" dense :items="eventos_seguridad"
                            v-if="form.tipo_evento == 'Seguridad'">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea auto-grow v-model="form.observaciones" label="Observaciones"></v-textarea>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="agregar()" small color="success">Agregar</v-btn>
                </v-card-actions>
            </v-col>
            <v-col cols="6">
                <v-alert icon="mdi-history" text color="blue-grey" dense border="left">Registro histórico eventos de
                    ingreso
                    concurrencia</v-alert>
                <v-data-table dense :headers="headers" :items="eventos" :items-per-page="5"
                    no-data-text="Aún no hay registros">
                    <template v-slot:[`item.usuario_registra`]="{ item }">
                        {{ item.user?.operador?.nombre || '' }} {{ item.user?.operador?.apellido || '' }}
                    </template>
                    <template v-slot:[`item.tipo_evento`]="{ item }">
                        <v-chip small :color="colorTipoEvento(item.tipo_evento)" dark>
                            {{ item.tipo_evento }}
                        </v-chip>
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon small color="error" @click="eliminarRegistro(item)">
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-dialog v-model="dialogMotivo" max-width="600px" persistent>
            <v-card>
                <v-alert text dense border="left" color="error" icon="mdi-trash-can">Proceso de eliminación de
                    evento</v-alert>
                <v-card-text>
                    <v-textarea auto-grow v-model="form.motivo_eliminacion"
                        label="Por favor ingrese el motivo de la eliminación" required outlined></v-textarea>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="dialogMotivo = false">Cancelar</v-btn>
                    <v-btn color="success" small @click="confirmarEliminar">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonEventosIngresoConcurrencia',

    data() {
        return {
            headers: [{
                text: 'Id',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Evento',
                align: 'start',
                sortable: false,
                value: 'evento',
            },
            {
                text: 'Observaciones',
                align: 'start',
                sortable: false,
                value: 'observaciones',
            },
            {
                text: 'Tipo de evento',
                align: 'center',
                sortable: false,
                value: 'tipo_evento',
            },
            {
                text: 'Usuario registra',
                align: 'start',
                sortable: false,
                value: 'usuario_registra',
            },
            {
                text: 'Acciones',
                value: 'acciones',
                sortable: false,
            },
            ],
            form: {
                evento: null,
                observaciones: null,
                ingreso_concurrencia_id: null,
                tipo_evento: null,
                user_id: null,
                motivo_eliminacion: null,
            },
            eventos: [],
            eventos_centinelas: [
                "Bajo Peso al nacer",
                "Hospitalización por EDA en niños de 3 a 5 años",
                "Hospitalización por neumonia en niños y niñas de 3 a 5 años",
                "Muerte Materna",
                "Muerte por Dengue",
                "Muerte por Malaria",
                "Otitis Media Supurativa en menores de 5 años",
            ],
            eventos_seguridad: [
                "Asalto sexual en la institución",
                "Asfixia perinatal",
                "Cirugía en parte equivocada o en paciente equivocado",
                "Cirugías o procedimientos cancelados por factores atribuibles al desempeño de la organización o de los profesionales",
                "Consumo intra - institucional de Psicoactivos",
                "Deterioro del paciente en la clasificación en la escala de Glasgow sin tratamiento",
                "Distocia inadvertida",
                "Entrega equivocada de reportes de laboratorio",
                "Entrega equivocada de un neonato",
                "Error en el diagnostico",
                "Estancia prolongada por no disponibilidad de insumos o medicamentos",
                "Eventos asociados al uso de dispositivos médicos y equipos biomédicos",
                "Eventos postransfusionales",
                "Eventos relacionados con la administración de medicamentos",
                "Eventración o evisceración o dehiscencia de sutura",
                "Extubación o decanulación no programada",
                "Flebitis mecánica - Flebitis en sitios de venopunción",
                "Fuga de pacientes siquiátricos y menores de 14 años hospitalizados",
                "Infección del Sitio Operatorio - ISO",
                "Infección del Torrente Sanguineo Asociado a catéter en UCI",
                "Infección del Tracto Urinario Asociado a Catéter en UCI",
                "Infecciones asociadas a la atención en salud - IAAS (Nosocomiales)",
                "Ingreso no programado a UCI luego de procedimiento que implica la administración de anestesia",
                "Lesión de órgano secundario a procedimiento",
                "Lesiones causadas por caídas institucional",
                "Luxación post - quirúrgica en reemplazo de cadera",
                "Maternas con convulsión intrahospitalaria",
                "Neumonia Asociada a Ventilador Mecanico en UCI",
                "Neumotórax por ventilación mecánica o asociado a paso de catéter venoso central",
                "Otros eventos de seguridad del paciente identificados",
                "Pacientes con diagnóstico que apendicitis que no son atendidos después de 12 horas de realizado el diagnostico",
                "Pacientes con hipotensión severa en post – quirúrgico",
                "Pacientes con infarto en las siguientes 72 horas post – quirúrgico",
                "Pacientes con neumonías broncoaspirativas en pediatría o UCI neonatal",
                "Pacientes con trombosis venosa profunda a quienes no se les realiza control de pruebas de coagulación",
                "Pacientes con úlceras de posición",
                "Pérdida de pertenencias de usuarios",
                "Problemas relacionados con el uso de medicamentos (PRUM)",
                "Quemaduras por equipos biomédicos",
                "Quemaduras por lámparas de fototerapia y para electrocauterio",
                "Reacción adversa a los medicamentos",
                "Reingreso a hospitalización por la misma causa antes de 15 días",
                "Reingreso al servicio de urgencias por misma causa antes de 72 Horas",
                "reingreso por la misma causa o causa asociada antes de 30 dias",
                "Retención de cuerpos extraños en pacientes internados",
                "Retiro accidental o autoretiro de dispositivos invasivos",
                "Revisión de reemplazos articulares por inicio tardío de la rehabilitación",
                "Robo intra – institucional de niños",
                "Ruptura prematura de membranas sin conducta definida",
                "Secuelas post – reanimación",
                "Shock hipovolémico post – parto (Código rojo)",
                "Suicidio de pacientes internados",
            ],
            eventos_notificacion: [
                "Anomalías congénitas",
                "Hipotiroidismo congénito",
                "Mortalidad EDA <5 años",
                "Mortalidad infantil <1 año",
                "Mortalidad IRA/neumonía <5",
                "Mortalidad IRA/neumonía >65",
                "Mortalidad perinatal",
                "Mortalidad por otra EISP",
                "Sífilis congénita",
                "Sífilis gestacional",
                "VIH/gestante infectada",
                "VIH/mortalidad por VIH-SIDA",
                "VIH/RN vivo gestante infectada",
            ],
            dialogMotivo: false,
        };
    },

    props: {
        IngresoConcurrencia: {
            type: Number,
            default: {},
        }
    },

    mounted() {
        this.listarEventos()
    },

    methods: {

        agregar() {
            this.form.ingreso_concurrencia_id = this.IngresoConcurrencia
            this.form.user_id = this.$store.state.auth.usuario.id
            this.$axios.post("evento-ingreso-concurrencia/guardarEvento", this.form).then((res) => {
                this.listarEventos()
                this.form.evento = null
                this.form.observaciones = null
                this.form.tipo_evento = null
                return this.$toast.success('se ha aregistrado el evento correctamente!.')
            })
                .catch((e) => {
                    this.$toast.error(e.response.data.message);
                })
        },

        listarEventos() {
            this.form.ingreso_concurrencia_id = this.IngresoConcurrencia
            this.$axios.post("evento-ingreso-concurrencia/listarEvento", {
                id: this.form.ingreso_concurrencia_id
            }).then((res) => {
                this.eventos = res.data;
            })
                .catch((e) => {
                    console.log(e);

                });
        },

        colorTipoEvento(tipo_evento) {
            if (tipo_evento == "Centinela") return "green"
            else if (tipo_evento == "Notificación inmediata") return "orange"
            else if (tipo_evento == "Seguridad") return "info"
            else return "green";
        },

        eliminarRegistro(item) {
            if (!this.form.motivo_eliminacion) {
                this.dialogMotivo = true;
                this.itemParaEliminar = item;
            } else {
                this.$axios.post('/evento-ingreso-concurrencia/eliminarEvento/', {
                    id: item.id,
                    motivo_eliminacion: this.form.motivo_eliminacion,
                })
                    .then(res => {
                        this.listarEventos();
                        this.$toast.success('Se ha eliminado el registro correctamente!.');
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },

        confirmarEliminar() {
            if (!this.form.motivo_eliminacion) {
                this.$toast.error('Debe ingresar un motivo para continuar.');
                return;
            }

            this.$axios.post('/evento-ingreso-concurrencia/eliminarEvento/', {
                id: this.itemParaEliminar.id,
                motivo_eliminacion: this.form.motivo_eliminacion,
            })
                .then(res => {
                    this.listarEventos();
                    this.$toast.success('Se ha eliminado el registro correctamente!.');
                })
                .catch(e => {
                    console.log(e);
                });

            this.dialogMotivo = false;
            this.form.motivo_eliminacion = '';
        }
    },

};

</script>
